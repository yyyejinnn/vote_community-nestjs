import { Injectable, NotFoundException } from '@nestjs/common';
import {
  RefreshTokensEntity,
  SignUpUserDto,
  UsersEntity,
  WhereOption,
} from '@vote/common';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  async createUser(dto: SignUpUserDto): Promise<UsersEntity> {
    const { email, nickname, password } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // to entity
    const entity = UsersEntity.from(email, nickname, hashedPassword);
    const userEntity = UsersEntity.create(entity);

    return await UsersEntity.save(userEntity);
  }

  async findUserByWhereOption(whereOption: WhereOption): Promise<UsersEntity> {
    const user = await UsersEntity.findOne({
      where: whereOption,
    });

    return user;
  }

  async findMatchedRefreshToken(
    userId: number,
    encryptRefreshToken: string,
  ): Promise<UsersEntity> {
    return await UsersEntity.findOne({
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
    const refreshToken = await RefreshTokensEntity.findOne({
      where: {
        userId,
      },
    });
    refreshToken.token = encryptedRefreshToken;
    return await RefreshTokensEntity.save(refreshToken);
  }

  async signOut(userId: number) {
    const result = await UsersEntity.delete({
      id: userId,
    });

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async updatePassword(userId: number, password: string) {
    await UsersEntity.update(userId, {
      password: await bcrypt.hash(password, 10),
    });
  }

  async deleteUser(userId: number) {
    await UsersEntity.delete({ id: userId });
  }
}
