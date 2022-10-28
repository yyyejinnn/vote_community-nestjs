import { Injectable } from '@nestjs/common';
import {
  CreateVoteCommentDto,
  CreateVotedUserDto,
  LikesVoteDto,
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

  async likeVote(data: LikesVoteDto) {
    await this.votesRepository.createLikedUser(data);
    return;
  }

  async cancleLikedVote(data: LikesVoteDto) {
    await this.votesRepository.deleteLikedUser(data);
  }
}

@Injectable()
export class CommentsService {
  constructor(private readonly commentsRepository: CommentsRepository) {}

  async createVoteComment(data: CreateVoteCommentDto) {
    return await this.commentsRepository.createVoteComment(data);
  }
}
