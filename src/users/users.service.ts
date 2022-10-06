import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { SignUpUserDto, SignInUserDto } from 'src/common/dto/users.dto';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  private readonly tokenService = new TokenService();

  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserProfile() {
    return await this.usersRepository.getUser();
  }

  async signUp(data: SignUpUserDto) {
    // 1. 이메일 중복 확인
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (user) {
      throw new CustomException(UsersException.USER_ALREADY_EXISTS);
    }

    // 2. 비밀번호 일치 여부
    this._validatePassword(data.password, data.checkPassword);

    // 3. 중복 닉네임 확인
    await this._validateNickname(data.nickname);

    const createdUser: Users = await this.usersRepository.createUser(data);

    return { users: createdUser };
  }

  async signIn(data: SignInUserDto) {
    const user: Users = await this.usersRepository.findUserByEmail(data.email);

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }

    this._validatePassword(user.password, data.password);

    const payload = { sub: user.id, nickname: user.nickname };

    const accessToken = this.tokenService.createAccessToken(payload);
    const refreshToken = this.tokenService.createRefreshToken(payload);

    return { accessToken, refreshToken };
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

class TokenService {
  createAccessToken(payload) {
    return;
  }

  createRefreshToken(payload) {
    // 생성
    // 암호화
    // db 저장
    return;
  }
}
