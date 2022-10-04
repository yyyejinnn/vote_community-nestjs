import { Body, Controller, Get, Post } from '@nestjs/common';
import { Users } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getUserProfile() {
    return this.usersService.getUserProfile();
  }

  @Post('sign-up')
  async signUp(@Body() data: SignUpUserDto): Promise<Users> {
    return await this.usersService.signUp(data);
  }
}
