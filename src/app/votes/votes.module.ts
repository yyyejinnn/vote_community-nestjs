import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  ChoicedUsersEntity,
  TagsEntity,
  VoteChoicesEntity,
  VotedUsersEntity,
  VotesEntity,
} from '@vote/common';
import { CommentsEntity } from 'src/common/entity/comments.entity';
import { CommentsController } from '../comments/comments.controller';
import { CommentsModule } from '../comments/comments.module';
import { UsersModule } from '../users/users.module';
import { VotesController } from './votes.controller';
import { VotesService } from './votes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      VotesEntity,
      TagsEntity,
      VoteChoicesEntity,
      VotedUsersEntity,
      ChoicedUsersEntity,
      CommentsEntity,
    ]),
    forwardRef(() => UsersModule),
    forwardRef(() => CommentsModule),
  ],
  controllers: [VotesController],
  providers: [VotesService],
  exports: [TypeOrmModule, VotesService],
})
export class VotesModule {}
