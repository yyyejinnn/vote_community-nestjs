import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { SignInUserDto, SignUpUserDto } from 'src/common/dto/users.dto';
import {
  GetUserCreatedVotes,
  GetUserProfile,
  RecreateAccessToken,
  SignIn,
  SignUp,
  WhereOptionByUserId,
} from 'src/common/interface/users.interface';
import { VotesRepository } from 'src/votes/votes.repository';
import { JwtAccessGuard } from './jwt/jwt.guard';
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

  @Post('sign-up')
  async signUp(@Body() data: SignUpUserDto): Promise<SignUp> {
    return await this.usersService.signUp(data);
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInUserDto): Promise<SignIn> {
    return await this.usersService.signIn(data);
  }

  @UseGuards(JwtAccessGuard)
  @Post('recreate/access-token')
  async recreateAccessToken(
    @Body('refreshToken') refreshToken: string,
  ): Promise<RecreateAccessToken> {
    return await this.usersService.recreateAccessToken(refreshToken);
  }

  @UseGuards(JwtAccessGuard)
  @Get('access-test')
  accessTest() {
    return 'Access token test';
  }
}
