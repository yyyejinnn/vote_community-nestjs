import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  RefreshTokensEntity,
  SignUpUserDto,
  UsersEntity,
  WhereOption,
} from '@vote/common';
import { RefreshTokensRepository, UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,

    @InjectRepository(RefreshTokensRepository)
    private readonly refreshTokenRepository: RefreshTokensRepository,
  ) {}

  async createUser(dto: SignUpUserDto) {
    return await this.usersRepository.createUser(dto);
  }

  async findUserByWhereOption(whereOption: WhereOption): Promise<UsersEntity> {
    return await this.usersRepository.findUserByWhereOption(whereOption);
  }

  async findMatchedRefreshToken(userId: number, encryptRefreshToken: string) {
    return await this.usersRepository.findOne({
      where: {
        id: userId,
        refreshToken: {
          token: encryptRefreshToken,
        },
      },
    });
  }

  async createRefreshToken(userId: number, encryptRefreshToken: string) {
    return await this.refreshTokenRepository.createRefreshToken(
      userId,
      encryptRefreshToken,
    );
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
    return await this.usersRepository.updatePassword(userId, password);
  }
}
