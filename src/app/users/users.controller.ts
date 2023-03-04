import { Controller, Get, Patch, UseInterceptors } from '@nestjs/common';
import { UploadedFile } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { WhereOptionByUserId } from '@vote/common';
import { CommentsService, VotesService } from '../votes/votes.service';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly votesService: VotesService,
    private readonly commentsService: CommentsService,
  ) { }

  @Get('profile')
  async getUserProfile() {
    const userId = 1; //임시
    const whereOption: WhereOptionByUserId = { id: userId };
    return {
      users: await this.usersService.findUserByWhereOption(whereOption),
    };
  }


  @Patch('profile-photo')
  @UseInterceptors(FileInterceptor('profilePhoto'))
  async updateProfilePhoto(@UploadedFile() photo: Express.Multer.File) {
    const userId = 1;
    await this.usersService.updateProfilePhoto(userId, photo)
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
