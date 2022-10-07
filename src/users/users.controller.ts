import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { Users } from '@prisma/client';
import { SignInUserDto, SignUpUserDto } from 'src/common/dto/users.dto';
import { JwtAccessGuard } from './jwt/jwt.guard';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUserProfile() {
    return this.usersService.getUserProfile();
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
  async recreateAccessToken(@Body('refreshToken') refreshToken: string) {
    return await this.usersService.recreateAccessToken(refreshToken);
  }

  @UseGuards(JwtAccessGuard)
  @Get('access-test')
  accessTest() {
    return 'Access token test';
  }
}
