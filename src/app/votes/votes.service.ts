import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
  UpdateVoteDto,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import { CommentsRepository, VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async createVote(data: CreateVoteDto) {
    const { endDate } = data;
    this._compareDates(endDate);

    return await this.votesRepository.createVote(data);
  }

  async updateVote(data: UpdateVoteDto) {
    const { endDate } = data;
    this._compareDates(endDate);

    return this.votesRepository.updateVote(data);
  }

  async choiceVote(data: CreateVotedUserDto) {
    try {
      return await this.votesRepository.createVotedUser(data);
    } catch (error) {
      throw new CustomException(VotesException.ALREADY_VOTED);
    }
  }

  async likeVote(data: LikesVoteDto) {
    await this.votesRepository.createLikedUser(data);
  }

  async cancleLikedVote(data: LikesVoteDto) {
    await this.votesRepository.deleteLikedUser(data);
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

  async createVoteComment(data: CreateVoteCommentDto) {
    if (data.content === '') {
      throw new CustomException(VotesException.EMPTY_COMMENT_CONTENT);
    }
    return await this.commentsRepository.createVoteComment(data);
  }

  async likeVoteComment(data: LikesVoteCommentDto) {
    await this.commentsRepository.createLikedUser(data);
  }

  async cancleLikedVoteComment(data: LikesVoteCommentDto) {
    await this.commentsRepository.deleteLikedUser(data);
  }
}
