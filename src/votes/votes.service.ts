import { Injectable } from '@nestjs/common';
import {
  CreateVoteCommentDto,
  CreateVotedUserDto,
  LikeVoteDto,
  VotesException,
} from '@vote/common';
import { CustomException } from '@vote/middleware';
import { CommentsRepository, VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async choiceVote(data: CreateVotedUserDto) {
    try {
      return await this.votesRepository.createVotedUser(data);
    } catch (error) {
      throw new CustomException(VotesException.ALREADY_VOTED);
    }
  }

  async likeVote(data: LikeVoteDto) {
    await this.votesRepository.createLikedUser(data);
    return;
  }
}

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createVoteComment(data: CreateVoteCommentDto) {
    return await this.commentsRepository.createVoteComment(data);
  }
}
