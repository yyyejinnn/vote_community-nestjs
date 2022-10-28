import { Injectable } from '@nestjs/common';
import { PrismaClient, RefreshTokens, Users } from '@prisma/client';
import { SignUpUserDto, UsersException, WhereOption } from '@vote/common';
import { CustomException } from '@vote/middleware';
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

  async findUserByWhereOption(whereOption: WhereOption): Promise<Users> {
    return await this.prisma.users.findFirst({
      where: whereOption,
    });
  }

  async createRefreshToken(
    userId: number,
    encryptedRefreshToken: string,
  ): Promise<RefreshTokens> {
    try {
      return await this.prisma.refreshTokens.create({
        data: {
          token: encryptedRefreshToken,
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

  async findMatchedRefreshToken(
    userId: number,
    encryptRefreshToken: string,
  ): Promise<RefreshTokens> {
    return await this.prisma.refreshTokens.findFirst({
      where: {
        userId: userId,
        token: encryptRefreshToken,
      },
    });
  }
}
