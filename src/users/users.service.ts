import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserProfile() {
    return await this.usersRepository.getUser();
  }

  async signUp(data: SignUpUserDto): Promise<Users> {
    // 1. 이메일 중복 확인
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (user) {
      throw new CustomException(UsersException.USER_ALREADY_EXISTS);
    }

    // 2. 비밀번호 일치 여부
    this._validatePassword(data.password, data.checkPassword);

    // 3. 중복 닉네임 확인
    await this._validateNickname(data.nickname);

    const response: Users = await this.usersRepository.createUser(data);

    return response;
  }

  private _validatePassword(password: string, checkPassword: string) {
    if (password !== checkPassword) {
      throw new CustomException(UsersException.NOT_MATCHED_PASSWORD);
    }
  }

  private async _validateNickname(nickname: string) {
    const user = await this.usersRepository.findUserByNickName(nickname);

    if (user) {
      throw new CustomException(UsersException.NICKNAME_ALREADY_EXISTS);
    }
  }
}
