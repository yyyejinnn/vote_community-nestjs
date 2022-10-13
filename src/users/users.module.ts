import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtAccessStrategy } from './jwt/jwt.strategy';
import { UsersController } from './users.controller';
import { UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt-access-token' }),
    JwtModule.register({
      secret: 'access-secret-key',
      signOptions: {
        expiresIn: '3m', //임시
      },
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService, UsersRepository, JwtAccessStrategy],
  exports: [JwtAccessStrategy],
})
export class UsersModule {}
