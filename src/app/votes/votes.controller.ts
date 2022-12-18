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
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
} from '@vote/common';
import { CommentsService, VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post()
  async createVote(@Body() dto) {
    dto['userId'] = 2; //임시
    return await this.votesService.createVote(dto);
  }

  @Get()
  async listVotes() {
    return { votes: await this.votesService.listVotes() };
  }

  @Get(':voteId')
  async getVote(@Param('voteId', ParseIntPipe) voteId: number) {
    return { vote: await this.votesService.getVoteById(voteId) };
  }

  @Patch(':voteId')
  async updateVote(
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body() body: Omit<UpdateVoteDto, 'userId' | 'voteId'>,
  ) {
    const data: UpdateVoteDto = {
      ...body,
      voteId,
    };

    return { votes: await this.votesService.updateVote(voteId, data) };
  }

  @Delete(':voteId')
  async deleteVote(@Param('voteId', ParseIntPipe) voteId: number) {
    return await this.votesService.deleteVote(voteId);
  }

  @Post(':voteId/choice/vote')
  async choiceVote(
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body('choicedId') choicedVoteId: number,
  ) {
    const userId = 2; // 임시
    console.log(voteId);
    console.log(choicedVoteId);

    const data: CreateVotedUserDto = {
      voteId,
      userId,
      choicedVoteId: choicedVoteId,
    };

    return await this.votesService.choiceVote(data);
  }

  @Post(':voteId/like')
  async likeVote(@Param('voteId', ParseIntPipe) voteId: number) {
    const userId = 2;

    const data: LikesVoteDto = {
      voteId,
      userId,
    };

    await this.votesService.likeVote(data);
  }

  @Post(':voteId/cancle/likes')
  async cancleLikedVote(@Param('voteId', ParseIntPipe) voteId: number) {
    const userId = 1;

    const data: LikesVoteDto = {
      voteId,
      userId,
    };

    await this.votesService.cancleLikedVote(data);
  }
}

@Controller('votes/:voteId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  async getVoteComments(@Param('voteId', ParseIntPipe) voteId: number) {
    return await this.commentsService.getAllVoteComments(voteId);
  }

  @Post()
  async createVoteComment(
    @Param('voteId', ParseIntPipe) voteId: number,
    @Body('content') content: string,
  ) {
    const userId = 1; //임시

    const data: CreateVoteCommentDto = {
      voteId,
      userId,
      content,
    };

    return await this.commentsService.createVoteComment(data);
  }

  @Patch(':commentId')
  async updateVoteComment(
    @Param('commentId', ParseIntPipe) commentId: number,
    @Body() body: Omit<UpdateVoteCommentDto, 'commentId'>,
  ) {
    const data: UpdateVoteCommentDto = {
      ...body,
      commentId,
    };

    return { comments: await this.commentsService.updateVoteComment(data) };
  }

  @Delete(':commentId')
  async deleteVoteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    return await this.commentsService.deleteVoteComment(commentId);
  }

  @Post(':commentId/like')
  async likeVoteComment(@Param('commentId', ParseIntPipe) commentId: number) {
    const userId = 1;

    const data: LikesVoteCommentDto = {
      commentId,
      userId,
    };

    await this.commentsService.likeVoteComment(data);
  }

  @Post(':commentId/cancle/likes')
  async cancleLikedVoteComment(
    @Param('voteId', ParseIntPipe) commentId: number,
  ) {
    const userId = 1;

    const data: LikesVoteCommentDto = {
      commentId,
      userId,
    };

    await this.commentsService.cancleLikedVoteComment(data);
  }
}
