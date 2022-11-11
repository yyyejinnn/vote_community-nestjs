import {
  Body,
  Controller,
  Delete,
  Get,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  CurrUser,
  RecreateAccessToken,
  ResetPasswordDto,
  SignIn,
  SignInUserDto,
  SignOutUserDto,
  SignUp,
  SignUpUserDto,
} from '@vote/common';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() data: SignUpUserDto): Promise<SignUp> {
    return await this.authService.signUp(data);
  }

  @Post('sign-in')
  async signIn(@Body() data: SignInUserDto): Promise<SignIn> {
    return await this.authService.signIn(data);
  }

  @UseGuards(JwtAccessGuard)
  @Post('recreate/access-token')
  async recreateAccessToken(
    @CurrUser('id', ParseIntPipe) userId: number,
    @Body('refreshToken') encryptRefreshToken: string,
  ): Promise<RecreateAccessToken> {
    return await this.authService.recreateAccessToken(
      userId,
      encryptRefreshToken,
    );
  }

  @Delete('sign-out')
  async signOut() {
    const userId = 1;

    const data: SignOutUserDto = {
      userId,
    };

    return await this.authService.signOut(data);
  }

  @Patch('reset/password')
  async resetPassword(@Body() body: Omit<ResetPasswordDto, 'userId'>) {
    const userId = 1;

    const data: ResetPasswordDto = {
      ...body,
      userId,
    };

    return await this.authService.resetPassword(data);
  }

  @UseGuards(JwtAccessGuard)
  @Get('access-test')
  accessTest() {
    return 'Access token test';
  }
}
