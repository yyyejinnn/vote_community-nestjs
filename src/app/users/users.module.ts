import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RefreshTokensEntity, UsersEntity } from '@vote/common';
import { TokenService } from '../auth/auth.service';
import { S3Service } from '../service/s3.service';
import { ServiceModule } from '../service/service.module';
import { VotesModule } from '../votes/votes.module';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    forwardRef(() => VotesModule),
    TypeOrmModule.forFeature([UsersEntity, RefreshTokensEntity]),
    ServiceModule,
  ],
  controllers: [UsersController],
  providers: [UsersService, TokenService, S3Service],
  exports: [TypeOrmModule, UsersService, TokenService],
})
export class UsersModule { }
