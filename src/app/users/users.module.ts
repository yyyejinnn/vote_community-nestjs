import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensEntity, UsersEntity } from '@vote/common';
import { VotesModule } from '../votes/votes.module';
import { UsersController } from './users.controller';
import { RefreshTokensRepository, UsersRepository } from './users.repository';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => VotesModule),
    TypeOrmModule.forFeature([
      UsersEntity,
      UsersRepository,
      RefreshTokensEntity,
      RefreshTokensRepository,
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule],
})
export class UsersModule {}
