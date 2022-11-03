import { HttpException, Injectable } from '@nestjs/common';
import {
  CreateVoteCommentDto,
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
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
  }

  async cancleLikedVote(data: LikesVoteDto) {
    await this.votesRepository.deleteLikedUser(data);
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
