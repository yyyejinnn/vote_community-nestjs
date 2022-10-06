import { Injectable } from '@nestjs/common';
import { PrismaClient, RefreshTokens, Users } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import * as bcrypt from 'bcrypt';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';

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

  async findUserById(id: number): Promise<Users> {
    return await this.prisma.users.findFirst({
      where: {
        id,
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

  async createRefreshToken(userId: number, refreshToken: string) {
    try {
      await this.prisma.refreshTokens.create({
        data: {
          token: refreshToken, // 암호화
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    } catch (error) {
      throw new CustomException(UsersException.REFRESH_TOKEN_EXIST);
    }
  }

  async getUser() {
    return this.prisma.users.findUnique({
      where: {
        id: 1, // 임시
      },
    });
  }
}
