import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { CommentsController, VotesController } from './votes.controller';
import { CommentsRepository, VotesRepository } from './votes.repository';
import { CommentsService, VotesService } from './votes.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [VotesController, CommentsController],
  providers: [
    VotesService,
    VotesRepository,
    CommentsService,
    CommentsRepository,
  ],
  exports: [VotesRepository],
})
export class VotesModule {}
