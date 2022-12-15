import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import {
  CommentsRepository,
  VotesRepository,
  VotesRepository_,
} from './votes.repository';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(VotesRepository_)
    private readonly votesRepository_: VotesRepository_,
    private readonly votesRepository: VotesRepository,
  ) {}

  async createVote(data: CreateVoteDto) {
    const { endDate } = data;
    this._compareDates(endDate);

    return await this.votesRepository.createVote(data);
  }

  async updateVote(dto: UpdateVoteDto) {
    const { endDate } = dto;
    this._compareDates(endDate);

    return await this.votesRepository.updateVote(dto);
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
