import { Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { Inject, UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { WhereOptionByUserId } from '@vote/common';
import { CommentsService } from '../comments/comments.service';
import { CommentsServiceInterface } from '../comments/comments.service.interface';
import { VotesService } from '../votes/votes.service';
import { VotesServiceInterface } from '../votes/votes.service.interface';
import { UsersService } from './users.service';
import { UsersServiceInterface } from './users.service.interface';

@Controller('users')
export class UsersController {
  constructor(
    @Inject('USERS_SERVICE')
    private readonly usersService: UsersServiceInterface,
    @Inject('VOTES_SERVICE')
    private readonly votesService: VotesServiceInterface,
    @Inject('COMMENTS_SERVICE')
    private readonly commentsService: CommentsServiceInterface,
  ) {}

  @Get()
  async getAllUsers() {
    return {
      users: await this.usersService.getAllUsers(),
    };
  }

  @Get('profile')
  async getUserProfile() {
    const userId = 2; //임시
    return {
      users: await this.usersService.getUserProfile(userId),
    };
  }

  @Patch('profile-photo')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateProfilePhoto(@UploadedFile() photo: Express.Multer.File) {
    const userId = 2;
    await this.usersService.updateProfilePhoto(userId, photo);
  }

  @Get('written-votes')
  async getWrittenVotes() {
    const userId = 2; //임시
    return { votes: await this.votesService.getAllVotesByUserId(userId) };
  }

  @Get('written-comments')
  async getWrittenComments() {
    const userId = 2;
    return {
      comments: await this.commentsService.getAllCommentsByUserId(userId),
    };
  }
}
