import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RefreshTokensEntity,
  SignUpUserDto,
  UsersEntity,
  WhereOption,
} from '@vote/common';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(RefreshTokensEntity)
    private readonly refreshTokenRepository: Repository<RefreshTokensEntity>,
  ) {}

  async createUser(dto: SignUpUserDto): Promise<UsersEntity> {
    const { email, nickname, password } = dto;
    const userEntity = this.usersRepository.create({
      email,
      nickname,
      password: await bcrypt.hash(password, 10),
    });
    return await this.usersRepository.save(userEntity);
  }

  async findUserByWhereOption(whereOption: WhereOption): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      where: whereOption,
    });
  }

  async findMatchedRefreshToken(
    userId: number,
    encryptRefreshToken: string,
  ): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      where: {
        id: userId,
        refreshToken: {
          token: encryptRefreshToken,
        },
      },
    });
  }

  async createRefreshToken(
    userId: number,
    encryptedRefreshToken: string,
  ): Promise<RefreshTokensEntity> {
    const refreshToken = await this.refreshTokenRepository.findOne({
      where: {
        userId,
      },
    });
    refreshToken.token = encryptedRefreshToken;
    return await this.refreshTokenRepository.save(refreshToken);
  }

  async signOut(userId: number) {
    const result = await this.usersRepository.delete({
      id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async updatePassword(userId: number, password: string) {
    await this.usersRepository.update(userId, {
      password: await bcrypt.hash(password, 10),
    });
  }
}
