import { Injectable, NotFoundException } from '@nestjs/common';
import {
  ChoicedUsersEntity,
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
  VoteChoicesEntity,
  VotedUsersEntity,
  VotesEntity,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import { CommentsEntity } from 'src/common/entity/comments.entity';
import { UsersService } from '../users/users.service';

@Injectable()
export class VotesService {
  constructor(private readonly usersService: UsersService) {}

  async listVotes() {
    return await VotesEntity.find();
  }

  async getVoteById(voteId: number) {
    return await VotesEntity.findOne({
      relations: {
        voteChoices: {
          choiced: {
            user: true,
          },
        },
      },
      where: {
        id: voteId,
      },
    });
  }

  async getAllVotesByUserId(userId: number) {
    return await VotesEntity.find({
      where: {
        writerId: userId,
      },
    });
  }

  async createVote(userId: number, dto: CreateVoteDto) {
    const { title, endDate, voteChoices } = dto;
    this._compareDates(endDate);

    const writer = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const voteEntity = VotesEntity.create({
      title,
      endDate,
      writer,
      voteChoices: await Promise.all(
        voteChoices.map(async (value) => {
          const choice = new VoteChoicesEntity();
          choice.title = value;
          return await choice.save();
        }),
      ),
    });

    return await voteEntity.save();
  }

  async updateVote(voteId: number, { endDate }: UpdateVoteDto) {
    this._compareDates(endDate);

    await VotesEntity.update(voteId, {
      endDate,
    });
  }

  async deleteVote(voteId: number) {
    const result = await VotesEntity.delete(voteId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async choiceVote(
    voteId: number,
    userId: number,
    { choicedVoteId }: CreateVotedUserDto,
  ) {
    const user = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    // voted 생성
    const vote = await this.getVoteById(voteId);
    const voted = new VotedUsersEntity();
    voted.vote = vote;
    voted.user = user;
    await voted.save();

    // choiced 생성
    const choice = await VoteChoicesEntity.findOne({
      where: {
        id: choicedVoteId,
      },
    });

    const choiced = new ChoicedUsersEntity();
    choiced.choice = choice;
    choiced.user = user;
    await choiced.save();
  }

  async likeVote(voteId: number, userId: number) {
    const likedUser = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const vote = await VotesEntity.findOne({
      where: {
        id: voteId,
      },
    });
    vote.likedUsers.push(likedUser);

    await vote.save();
  }

  async cancleLikedVote(voteId: number, userId: number) {
    const vote = await VotesEntity.findOne({
      where: {
        id: voteId,
      },
    });

    vote.likedUsers = vote.likedUsers.filter((user) => {
      return user.id !== userId;
    });

    await vote.save();
  }

  private _compareDates(endDate: Date | string) {
    const date = new Date(endDate);
    const now = new Date();

    if (now >= date) {
      throw new CustomException(VotesException.END_DATE_LTE_TO_NOW);
    }
  }
}

@Injectable()
export class CommentsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly votesService: VotesService,
  ) {}

  async getAllVoteComments(voteId: number) {
    return await CommentsEntity.find({
      where: {
        voteId,
      },
    });
  }

  async getAllCommentsByUserId(userId: number) {
    return await CommentsEntity.find({
      where: {
        writerId: userId,
      },
    });
  }

  async createVoteComment(
    voteId: number,
    userId: number,
    { content }: CreateVoteCommentDto,
  ) {
    const user = await this.usersService.findUserByWhereOption({ id: userId });
    const vote = await this.votesService.getVoteById(voteId);
    const comment = CommentsEntity.create({
      content,
      writer: user,
      vote,
    });

    return await comment.save();
  }

  async updateVoteComment(
    commentId: number,
    { content }: UpdateVoteCommentDto,
  ) {
    await CommentsEntity.update(commentId, {
      content,
      isUpdate: true,
    });
  }

  async deleteVoteComment(commentId: number) {
    const result = await CommentsEntity.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async likeVoteComment(commentId: number, userId: number) {
    const likedUser = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const comment = await CommentsEntity.findOne({
      where: {
        id: commentId,
      },
    });
    comment.likedUsers.push(likedUser);

    await comment.save();
  }

  async cancleLikedVoteComment(commentId: number, userId: number) {
    const comment = await CommentsEntity.findOne({
      where: {
        id: commentId,
      },
    });
    comment.likedUsers = comment.likedUsers.filter((user) => {
      return user.id !== userId;
    });

    await comment.save();
  }
}
