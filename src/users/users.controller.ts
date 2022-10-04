import { Controller, Get, Post } from '@nestjs/common';
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
  signUp(data: SignUpUserDto) {
    return this.usersService.signUp(data);
  }
}
