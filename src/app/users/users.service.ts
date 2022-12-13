import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto, UsersEntity, WhereOption } from '@vote/common';
import { UsersRepository } from './users.repository';

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
}
