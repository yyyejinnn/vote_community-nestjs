import {
  Body,
  Controller,
  Get,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  RecreateAccessToken,
  SignIn,
  SignInUserDto,
  SignUp,
  SignUpUserDto,
} from '@vote/common';
import { CurrUser } from 'src/users/jwt/auth.decorator';
import { JwtAccessGuard } from 'src/users/jwt/jwt.guard';
import { AuthService } from './auth.service';

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

  @UseGuards(JwtAccessGuard)
  @Get('access-test')
  accessTest() {
    return 'Access token test';
  }
}
