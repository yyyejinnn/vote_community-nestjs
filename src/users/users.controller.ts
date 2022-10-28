import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  GetUserCreatedVotes,
  GetUserProfile,
  RecreateAccessToken,
  SignIn,
  SignInUserDto,
  SignUp,
  SignUpUserDto,
  WhereOptionByUserId,
} from '@vote/common';
import { VotesRepository } from 'src/votes/votes.repository';
import { CurrUser } from './jwt/auth.decorator';
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
    @CurrUser('id', ParseIntPipe) userId: number,
    @Body('refreshToken') encryptRefreshToken: string,
  ): Promise<RecreateAccessToken> {
    return await this.usersService.recreateAccessToken(
      userId,
      encryptRefreshToken,
    );
  }

  @UseGuards(JwtAccessGuard)
  @Get('access-test')
  accessTest() {
    return 'Access token test';
  }
}
