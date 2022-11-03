import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Users } from '@prisma/client';
import { JwtPayload, WhereOptionByUserId } from '@vote/common';
import { CustomException, UsersException } from '@vote/middleware';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersRepository } from 'src/app/users/users.repository';

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
