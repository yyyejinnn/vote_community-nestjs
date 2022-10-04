import { Injectable } from '@nestjs/common';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserProfile() {
    return await this.usersRepository.getUser();
  }

  async signUp(data: SignUpUserDto) {
    // 닉네임 중복 체크
    return this.usersRepository.createUser(data);
  }
}
