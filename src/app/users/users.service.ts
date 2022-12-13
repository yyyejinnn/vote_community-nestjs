import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto, UsersEntity, WhereOption } from '@vote/common';
import { RefreshTokensRepository, UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository)
    private readonly usersRepository: UsersRepository,
  ) {}

  async findUserByWhereOption(whereOption: WhereOption): Promise<UsersEntity> {
    return await this.usersRepository.findOne({
      where: whereOption,
    });
  }

  async createUser(dto: SignUpUserDto) {
    return await this.usersRepository.createUser(dto);
  }

  async signOut(userId: number) {
    const result = await this.usersRepository.delete(userId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
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
}
