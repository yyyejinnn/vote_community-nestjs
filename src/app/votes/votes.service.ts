import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChoicedUsersEntity,
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
  VoteChoicesEntity,
  VotedUsersEntity,
  VotesEntity,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import { CommentsEntity } from 'src/common/entity/comments.entity';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VotesEntity)
    private readonly votesRepository: Repository<VotesEntity>,
    @InjectRepository(VoteChoicesEntity)
    private readonly ChoicesRepository: Repository<VoteChoicesEntity>,
    private readonly usersService: UsersService,
  ) {}

  async listVotes() {
    return await this.votesRepository.find();
  }

  async getVoteById(voteId: number) {
    return await this.votesRepository.findOne({
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
    return await this.votesRepository.find({
      where: {
        writerId: userId,
      },
    });
  }

  async createVote(dto: CreateVoteDto) {
    const { title, endDate, userId, voteChoices } = dto;
    this._compareDates(endDate);

    const writer = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const voteEntity = this.votesRepository.create({
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

  async updateVote(voteId: number, dto: UpdateVoteDto) {
    const { endDate } = dto;
    this._compareDates(endDate);

    await this.votesRepository.update(voteId, {
      endDate,
    });
  }

  async deleteVote(voteId: number) {
    const result = await this.votesRepository.delete(voteId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async choiceVote(dto: CreateVotedUserDto) {
    const { voteId, userId, choicedVoteId } = dto;

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
    const choice = await this.ChoicesRepository.findOne({
      where: {
        id: choicedVoteId,
      },
    });

    const choiced = new ChoicedUsersEntity();
    choiced.choice = choice;
    choiced.user = user;
    await choiced.save();
  }

  async likeVote({ userId, voteId }: LikesVoteDto) {
    const likedUser = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const vote = await this.votesRepository.findOne({
      where: {
        id: voteId,
      },
    });
    vote.likedUsers.push(likedUser);

    return await vote.save();
  }

  async cancleLikedVote({ userId, voteId }: LikesVoteDto) {
    const vote = await this.votesRepository.findOne({
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
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly usersService: UsersService,
    private readonly votesService: VotesService,
  ) {}

  async getAllVoteComments(voteId: number) {
    return await this.commentsRepository.find({
      where: {
        voteId,
      },
    });
  }

  async getAllCommentsByUserId(userId: number) {
    return await this.commentsRepository.find({
      where: {
        writerId: userId,
      },
    });
  }

  async createVoteComment({ userId, voteId, content }: CreateVoteCommentDto) {
    const user = await this.usersService.findUserByWhereOption({ id: userId });
    const vote = await this.votesService.getVoteById(voteId);
    const comment = this.commentsRepository.create({
      content,
      writer: user,
      vote,
    });

    return await comment.save();
  }

  async updateVoteComment({ commentId, content }: UpdateVoteCommentDto) {
    await this.commentsRepository.update(commentId, {
      content,
      isUpdate: true,
    });
  }

  async deleteVoteComment(commentId: number) {
    const result = await this.commentsRepository.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async likeVoteComment({ userId, commentId }: LikesVoteCommentDto) {
    const likedUser = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    comment.likedUsers.push(likedUser);

    return await comment.save();
  }

  async cancleLikedVoteComment({ userId, commentId }: LikesVoteCommentDto) {
    const comment = await this.commentsRepository.findOne({
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
