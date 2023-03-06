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
  SignUpUserDto,
} from '@vote/common';
import { AuthService } from './auth.service';
import { JwtAccessGuard } from './jwt/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('sign-up')
  async signUp(@Body() dto: SignUpUserDto) {
    return { users: await this.authService.signUp(dto) };
  }

  @Post('sign-in')
  async signIn(@Body() dto: SignInUserDto) {
    return { users: await this.authService.signIn(dto) };
  }

  @UseGuards(JwtAccessGuard)
  @Post('recreate/access-token')
  async recreateAccessToken(
    @CurrUser('id', ParseIntPipe) userId: number,
    @Body('refreshToken') encryptRefreshToken: string,
  ) {
    return {
      accessToken: await this.authService.recreateAccessToken(
        userId,
        encryptRefreshToken,
      ),
    };
  }

  @Delete('sign-out')
  async signOut() {
    const userId = 2;
    await this.authService.signOut(userId);
  }

  @Patch('reset/password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    const userId = 2;
    await this.authService.resetPassword(userId, body);
  }

  @UseGuards(JwtAccessGuard)
  @Get('access-test')
  accessTest() {
    return 'Access token test';
  }
}
