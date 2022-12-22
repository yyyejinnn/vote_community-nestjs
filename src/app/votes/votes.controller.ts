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
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
} from '@vote/common';
import { CommentsService, VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  async createVote(@Body() dto: CreateVoteDto) {
    const userId = 2; //임시
    return { votes: await this.votesService.createVote(userId, dto) };
  }

  @Get()
  async listVotes() {
    return { votes: await this.votesService.listVotes() };
  }

  @Get(':voteId')
  async getVote(@Param('voteId', ParseIntPipe) voteId: number) {
    return { votes: await this.votesService.getVoteById(voteId) };
  }

  @Patch(':voteId')
  async updateVote(
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body() body: UpdateVoteDto,
  ) {
    return { votes: await this.votesService.updateVote(voteId, body) };
  }

  @Delete(':voteId')
  async deleteVote(@Param('voteId', ParseIntPipe) voteId: number) {
    await this.votesService.deleteVote(voteId);
  }

  @Post(':voteId/choice/vote')
  async choiceVote(
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body() body: CreateVotedUserDto,
  ) {
    const userId = 2; // 임시
    console.log(voteId);
    console.log(body);

    await this.votesService.choiceVote(voteId, userId, body);
  }

  @Post(':voteId/like')
  async likeVote(@Param('voteId', ParseIntPipe) voteId: number) {
    const userId = 2;
    await this.votesService.likeVote(voteId, userId);
  }

  @Post(':voteId/cancle/likes')
  async cancleLikedVote(@Param('voteId', ParseIntPipe) voteId: number) {
    const userId = 2;
    await this.votesService.cancleLikedVote(voteId, userId);
  }
}

@Controller('votes/:voteId/comments')
export class CommentsController {
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
    const userId = 1; //임시
    return {
      comments: await this.commentsService.createVoteComment(
        voteId,
        userId,
        body,
      ),
    };
  }

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
    const userId = 1;
    await this.commentsService.likeVoteComment(commentId, userId);
  }

  @Post(':commentId/cancle/likes')
  async cancleLikedVoteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
  ) {
    const userId = 1;
    await this.commentsService.cancleLikedVoteComment(commentId, userId);
  }
}
