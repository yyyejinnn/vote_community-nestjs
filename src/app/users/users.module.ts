import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensEntity, UsersEntity } from '@vote/common';
import { VotesModule } from '../votes/votes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => VotesModule),
    TypeOrmModule.forFeature([UsersEntity, RefreshTokensEntity]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [TypeOrmModule, UsersService],
})
export class UsersModule {}
