import { ExecutionContext, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from '@nestjs/passport';
import { UsersException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';

@Injectable()
export class JwtAccessGuard extends AuthGuard('jwt-access-token') {
  constructor(private readonly jwtService: JwtService) {
    super();
  }

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const { authorization } = request.headers;

    if (authorization === undefined) {
      throw new CustomException(UsersException.TOKEN_NOT_EXISTS);
    }

    const accessToken: string = authorization.split(' ')[1];

    try {
      this.jwtService.verify(accessToken, {
        secret: 'access-secret-key',
      });
    } catch (error) {
      switch (error.message) {
        case 'jwt expired':
          throw new CustomException(UsersException.EXPIRED_TOKEN);
        default:
          throw new CustomException(UsersException.UNVERIFIED_TOKEN);
      }
    }

    return super.canActivate(context);
  }
}
