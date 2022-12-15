import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from '../users/users.module';
import { CommentsController, VotesController } from './votes.controller';
import { CommentsRepository, VotesRepository } from './votes.repository';
import { CommentsService, VotesService } from './votes.service';

@Module({
  imports: [
    forwardRef(() => UsersModule),
    TypeOrmModule.forFeature([VotesRepository]),
  ],
  controllers: [VotesController, CommentsController],
  providers: [
    VotesService,
    VotesRepository,
    CommentsService,
    CommentsRepository,
  ],
  exports: [VotesRepository, CommentsRepository],
})
export class VotesModule {}
