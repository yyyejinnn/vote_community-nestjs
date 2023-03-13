import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ServiceModule } from '../service/service.module';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService, TokenService } from './auth.service';
import { JwtAccessStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [
    UsersModule,
    ServiceModule,
    PassportModule.register({ defaultStrategy: 'jwt-access-token' }),
    JwtModule.register({
      secret: process.env.ACCESS_TOKEN_SECRET_KEY,
      signOptions: {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME,
      },
    }),
  ],
  controllers: [AuthController],
  providers: [
    {
      provide: 'AUTH_SERVICE',
      useClass: AuthService,
    },
    TokenService,
    JwtAccessStrategy,
  ],
  exports: ['AUTH_SERVICE', JwtAccessStrategy],
})
export class AuthModule {}
