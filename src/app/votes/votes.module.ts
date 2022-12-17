import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VoteChoicesEntity, VotesEntity } from '@vote/common';
import { UsersModule } from '../users/users.module';
import { CommentsController, VotesController } from './votes.controller';
import { CommentsRepository, VotesRepository } from './votes.repository';
import { CommentsService, VotesService } from './votes.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([VotesEntity, VoteChoicesEntity]),
  ],
  controllers: [VotesController, CommentsController],
  providers: [
    VotesService,
    VotesRepository,
    CommentsService,
    CommentsRepository,
  ],
  exports: [TypeOrmModule, VotesRepository, CommentsRepository],
})
export class VotesModule {}
