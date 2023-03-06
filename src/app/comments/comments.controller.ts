import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateVoteCommentDto, UpdateVoteCommentDto } from '@vote/common';
import { CommentsService } from './comments.service';

@Controller('votes/:voteId/comments')
export class CommentsOfVoteController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getVoteComments(@Param('voteId', ParseIntPipe) voteId: number) {
    return { comments: await this.commentsService.getAllVoteComments(voteId) };
  }

  @Post()
  async createVoteComment(
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body() body: CreateVoteCommentDto,
  ) {
    const userId = 2; //임시
    return {
      comments: await this.commentsService.createVoteComment(
        voteId,
        userId,
        body,
      ),
    };
  }
}

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Patch(':commentId')
  async updateVoteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: UpdateVoteCommentDto,
  ) {
    return {
      comments: await this.commentsService.updateVoteComment(commentId, body),
    };
  }

  @Delete(':commentId')
  async deleteVoteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    await this.commentsService.deleteVoteComment(commentId);
  }

  @Post(':commentId/like')
  async likeVoteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    const userId = 2;
    await this.commentsService.likeVoteComment(commentId, userId);
  }

  @Post(':commentId/cancle/likes')
  async cancleLikedVoteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const userId = 2;
    await this.commentsService.cancleLikedVoteComment(commentId, userId);
  }
}
