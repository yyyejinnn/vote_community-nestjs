import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsEntity } from '@vote/common';
import { CommentsMapper } from 'src/common/entity/mapper/comments.mapper';
import { S3Service } from '../service/s3.service';
import { ServiceModule } from '../service/service.module';
import { UsersModule } from '../users/users.module';
import { UsersService } from '../users/users.service';
import { VotesModule } from '../votes/votes.module';
import { VotesService } from '../votes/votes.service';
import {
  CommentsController,
  CommentsOfVoteController,
} from './comments.controller';
import { CommentsService } from './comments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([CommentsEntity]),
    forwardRef(() => VotesModule),
    forwardRef(() => UsersModule),
    ServiceModule,
  ],
  controllers: [CommentsOfVoteController, CommentsController],
  providers: [
    {
      provide: 'COMMENTS_SERVICE',
      useClass: CommentsService,
    },
    CommentsMapper,
  ],
  exports: [TypeOrmModule, 'COMMENTS_SERVICE'],
})
export class CommentsModule {}
