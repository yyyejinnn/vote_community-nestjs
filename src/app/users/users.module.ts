import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@vote/common';
import { TokenService } from '../auth/auth.service';
import { CommentsModule } from '../comments/comments.module';
import { CommentsService } from '../comments/comments.service';
import { S3Service } from '../service/s3.service';
import { ServiceModule } from '../service/service.module';
import { VotesModule } from '../votes/votes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity]),
    forwardRef(() => VotesModule),
    forwardRef(() => CommentsModule),
    ServiceModule,
  ],
  controllers: [UsersController],
  providers: [
    {
      provide: 'USERS_SERVICE',
      useClass: UsersService,
    },
  ],
  exports: [TypeOrmModule, 'USERS_SERVICE'],
})
export class UsersModule {}
