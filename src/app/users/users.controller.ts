import { Controller, Get } from '@nestjs/common';
import { WhereOptionByUserId } from '@vote/common';
import { CommentsService, VotesService } from '../votes/votes.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly votesService: VotesService,
    private readonly commentsService: CommentsService,
  ) {}

  @Get('profile')
  async getUserProfile() {
    const userId = 1; //임시
    const whereOption: WhereOptionByUserId = { id: userId };
    return {
      users: await this.usersService.findUserByWhereOption(whereOption),
    };
  }

  @Get('written-votes')
  async getWrittenVotes() {
    const userId = 2; //임시
    return { votes: await this.votesService.getAllVotesByUserId(userId) };
  }

  @Get('written-comments')
  async getWrittenComments() {
    const userId = 2;
    return {
      comments: await this.commentsService.getAllCommentsByUserId(userId),
    };
  }
}
