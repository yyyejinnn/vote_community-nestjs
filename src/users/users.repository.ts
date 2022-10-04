import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';

@Injectable()
export class UsersRepository {
  private readonly prisma = new PrismaClient();

  async createUser(data: SignUpUserDto) {
    return await this.prisma.users.create({
      data: {
        email: data.email,
        nickname: data.nickname,
        password: data.password,
      },
    });
  }

  async getUser() {
    return this.prisma.users.findUnique({
      where: {
        id: 1, // 임시
      },
    });
  }
}
