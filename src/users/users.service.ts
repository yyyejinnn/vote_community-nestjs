import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getUserProfile() {
    return await this.usersRepository.getUser();
  }

  async signUp(data: SignUpUserDto): Promise<Users> {
    // 유효성 검사
    this._validatePassword(data.password, data.checkPassword);
    await this._validateNickname(data.nickname);

    return this.usersRepository.createUser(data);
  }

  private _validatePassword(password: string, checkPassword: string) {
    if (password !== checkPassword) {
      throw new BadRequestException('비밀번호가 일치하지 않습니다.');
    }
  }

  private async _validateNickname(nickname: string) {
    const prisma = new PrismaClient();

    const user = await prisma.users.findFirst({
      where: {
        nickname: nickname,
      },
    });

    if (user) {
      throw new BadRequestException('이미 존재하는 닉네임입니다.');
    }
  }
}
