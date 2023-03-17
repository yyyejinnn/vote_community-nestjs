import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SignUpUserDto, UsersEntity, WhereOption } from '@vote/common';
import { CustomException, UsersException } from '@vote/middleware';

import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { S3Service } from '../service/s3.service';
import { UsersServiceInterface } from './users.service.interface';

@Injectable()
export class UsersService implements UsersServiceInterface {
  constructor(
    @Inject('S3_SERVICE') private readonly s3: S3Service,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {}

  async createUser(dto: SignUpUserDto): Promise<UsersEntity> {
    const { email, nickname, password } = dto;
    const hashedPassword = await bcrypt.hash(password, 10);

    // to entity
    const entity = UsersEntity.from(email, nickname, hashedPassword);
    const userEntity = this.usersRepository.create(entity);

    return await this.usersRepository.save(userEntity);
  }

  async getAllUsers() {
    return await this.usersRepository.find();
  }

  async findUserByWhereOption(whereOption: WhereOption): Promise<UsersEntity> {
    const user = await this.usersRepository.findOne({
      where: whereOption,
    });

    return user;
  }

  async updateProfilePhoto(userId: number, profilePhoto: Express.Multer.File) {
    const folder = 'profile';
    const key = `profile_${userId}_${new Date().getTime()}`;

    await this.s3.uploadFile(folder, key, profilePhoto);

    await this.usersRepository.update(userId, {
      photo: key,
    });
  }

  async updatePassword(userId: number, password: string) {
    await this.usersRepository.update(userId, {
      password: await bcrypt.hash(password, 10),
    });
  }

  async deleteUser(userId: number) {
    await this.usersRepository.delete({ id: userId });
  }
}
