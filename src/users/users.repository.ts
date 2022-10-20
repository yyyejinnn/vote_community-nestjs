import { Injectable } from '@nestjs/common';
import { PrismaClient, RefreshTokens, Users } from '@prisma/client';
import { SignUpUserDto } from 'src/common/dto/users.dto';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';
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

  async findRefreshToken(refreshToken: string): Promise<RefreshTokens> {
    return await this.prisma.refreshTokens.findFirst({
      where: {
        token: refreshToken,
      },
    });
  }
}
