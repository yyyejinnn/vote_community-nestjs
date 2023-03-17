import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JwtPayload, WhereOptionByUserId } from '@vote/common';
import { CustomException, UsersException } from '@vote/middleware';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/app/users/users.service';
import { UsersServiceInterface } from 'src/app/users/users.service.interface';

@Injectable()
export class JwtAccessStrategy extends PassportStrategy(
  Strategy,
  'jwt-access-token',
) {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersService: UsersServiceInterface,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.ACCESS_TOKEN_SECRET_KEY,
    });
  }

  async validate(payload: JwtPayload) {
    const whereOption: WhereOptionByUserId = {
      id: payload.sub,
    };
    const user = await this.usersService.findUserByWhereOption(whereOption);

    if (!user) {
      throw new CustomException(UsersException.USER_NOT_EXIST);
    }

    const { password, ...userInfo } = user;

    return userInfo;
  }
}
