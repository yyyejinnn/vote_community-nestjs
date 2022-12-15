import { RefreshTokensEntity, SignUpUserDto, UsersEntity } from '@vote/common';
import * as bcrypt from 'bcrypt';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(UsersEntity)
export class UsersRepository extends Repository<UsersEntity> {
  async createUser(dto: SignUpUserDto): Promise<UsersEntity> {
    const { email, nickname, password } = dto;
    const userEntity = this.create({
      email,
      nickname,
      password: await bcrypt.hash(password, 10),
    });
    return await this.save(userEntity);
  }

  async updatePassword(userId: number, password: string) {
    const user = await this.findOne(userId);
    user.password = await bcrypt.hash(password, 10);
    return await this.save(user);
  }
}

@EntityRepository(RefreshTokensEntity)
export class RefreshTokensRepository extends Repository<RefreshTokensEntity> {
  async createRefreshToken(userId: number, encryptedRefreshToken: string) {
    const refreshToken = await this.findOne({
      where: {
        userId: userId,
      },
    });
    refreshToken.token = encryptedRefreshToken;
    return await this.save(refreshToken);
  }
}
