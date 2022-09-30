import { Injectable } from '@nestjs/common';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserProfile() {
    return await this.usersRepository.getUser();
  }

  signUp() {
    return 'signIn service';
  }
}
