import { Injectable } from '@nestjs/common';
import { PrismaClient, RefreshTokens, Users } from '@prisma/client';
import {
  SignInUserDto,
  SignUpUserDto,
  UsersEntity,
  WhereOption,
} from '@vote/common';
import * as bcrypt from 'bcrypt';
import { CustomException, UsersException } from '@vote/middleware';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
  async createUser(dto: SignUpUserDto): Promise<UsersEntity> {
    const { email, nickname, password } = dto;
    const user = this.create({
      email,
      nickname,
      password: await bcrypt.hash(password, 10),
    });
    return await this.save(user);
  }
}

@Injectable()
export class UsersRepository_ {
  private readonly prisma = new PrismaClient();

  async createUser({
    email,
    nickname,
    password,
  }: SignUpUserDto): Promise<Users> {
    return await this.prisma.users.create({
      data: {
        email,
        nickname,
        password: await bcrypt.hash(password, 10),
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

  async deleteRefreshToken(userId: number) {
    await this.prisma.refreshTokens.delete({
      where: {
        userId,
      },
    });
  }

  async updatePassword(userId: number, password: string) {
    return await this.prisma.users.update({
      where: {
        id: userId,
      },
      data: {
        password: await bcrypt.hash(password, 10),
      },
    });
  }
}
