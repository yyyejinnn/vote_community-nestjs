import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersException } from 'src/common/interface/exception';
import {
  JwtPayload,
  WhereOptionByUserId,
} from 'src/common/interface/users.interface';
import { CustomException } from 'src/common/middleware/http-exception.filter';
import { UsersRepository } from '../users.repository';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'access-secret-key', // 임시
    });
  }

  async validate(payload: JwtPayload) {
    const whereOption: WhereOptionByUserId = {
      id: payload.sub,
    };
    const user: Users = await this.usersRepository.findUserByWhereOption(
      whereOption,
    );

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }

    const { password, ...userInfo } = user;

    return userInfo;
  }
}
