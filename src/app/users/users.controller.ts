import { Controller, Get } from '@nestjs/common';
import {
  GetUserProfile,
  GetUserWrittenComments,
  GetUserWrittenVotes,
  WhereOptionByUserId,
} from '@vote/common';
import { CommentsRepository, VotesRepository } from '../votes/votes.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly votesRepository: VotesRepository,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  @Get('profile')
  async getUserProfile(): Promise<GetUserProfile> {
    const userId = 1; //임시
    const whereOption: WhereOptionByUserId = { id: userId };
    return {
      users: await this.usersRepository.findUserByWhereOption(whereOption),
    };
  }

  @Get('written-votes')
  async getWrittenVotes(): Promise<GetUserWrittenVotes> {
    const userId = 1; //임시
    return { votes: await this.votesRepository.getAllVotesByUserId(userId) };
  }

  @Get('written-comments')
  async getWrittenComments(): Promise<GetUserWrittenComments> {
    const userId = 1;
    return {
      comments: await this.commentsRepository.getAllCommentsByUserId(userId),
    };
  }
}
