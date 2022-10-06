import { Injectable } from '@nestjs/common';
import { PrismaClient, Users } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository {
  private readonly prisma = new PrismaClient();

  async createUser(data: SignUpUserDto): Promise<Users> {
    return await this.prisma.users.create({
      data: {
        email: data.email,
        nickname: data.nickname,
        password: await bcrypt.hash(data.password, 10),
      },
    });
  }

  async findUserByEmail(email: string): Promise<Users> {
    return await this.prisma.users.findFirst({
      where: {
        email,
      },
    });
  }

  async findUserByNickName(nickname: string): Promise<Users> {
    return await this.prisma.users.findFirst({
      where: {
        nickname,
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
