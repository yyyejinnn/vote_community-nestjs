import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
  VoteChoicesEntity,
  VotesEntity,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import { UsersService } from '../users/users.service';
import {
  CommentsRepository,
  VotesRepository,
  VotesRepository_,
} from './votes.repository';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VotesEntity)
    private readonly votesRepository, // private readonly votesRepository: VotesRepository,
    @InjectRepository(VoteChoicesEntity)
    private readonly votesChoicesRepository,
    private readonly usersService: UsersService,
  ) {}

  async listVotes() {
    return await this.votesRepository.find();
  }

  async getVoteById(voteId: number) {
    return await this.votesRepository.findOne(voteId);
  }

  async createVote(dto: CreateVoteDto) {
    const { title, endDate, userId, voteChoices } = dto;
    this._compareDates(endDate);

    const writer = await this.usersService.findUserByWhereOption({
      id: userId,
    });

    const voteEntity: VotesEntity = this.votesRepository.create({
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
    try {
      return await this.votesRepository.createVotedUser(dto);
    } catch (error) {
      throw new CustomException(VotesException.ALREADY_VOTED);
    }
  }

  async likeVote(dto: LikesVoteDto) {
    return await this.votesRepository.createLikedUser(dto);
  }

  async cancleLikedVote(dto: LikesVoteDto) {
    await this.votesRepository.deleteLikedUser(dto);
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
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createVoteComment(dto: CreateVoteCommentDto) {
    return await this.commentsRepository.createVoteComment(dto);
  }

  async updateVoteComment(dto: UpdateVoteCommentDto) {
    return await this.commentsRepository.updateVoteComment(dto);
  }

  async likeVoteComment(dto: LikesVoteCommentDto) {
    await this.commentsRepository.createLikedUser(dto);
  }

  async cancleLikedVoteComment(dto: LikesVoteCommentDto) {
    await this.commentsRepository.deleteLikedUser(dto);
  }
}
