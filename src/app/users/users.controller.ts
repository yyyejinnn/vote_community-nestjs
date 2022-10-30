import { Controller, Get } from '@nestjs/common';
import {
  GetUserCreatedVotes,
  GetUserProfile,
  WhereOptionByUserId,
} from '@vote/common';
import { VotesRepository } from '../votes/votes.repository';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly usersRepository: UsersRepository,
    private readonly voteRepository: VotesRepository,
  ) {}

  @Get('profile')
  async getUserProfile(): Promise<GetUserProfile> {
    const userId = 1; //임시
    const whereOption: WhereOptionByUserId = { id: userId };
    return {
      users: await this.usersRepository.findUserByWhereOption(whereOption),
    };
  }

  @Get('created-votes')
  async getUserCreatedVotes(): Promise<GetUserCreatedVotes> {
    const userId = 1; //임시
    return { votes: await this.voteRepository.getAllVotesByUserId(userId) };
  }
}
