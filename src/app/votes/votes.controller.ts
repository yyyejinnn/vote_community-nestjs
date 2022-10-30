import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  GetVote,
  LikesVoteDto,
  ListVotes,
} from '@vote/common';
import { CommentsRepository, VotesRepository } from './votes.repository';
import { CommentsService, VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    private readonly votesRepository: VotesRepository,
  ) {}

  @Post()
  async createVote(@Body() data: CreateVoteDto) {
    data['userId'] = 2; //임시
    return await this.votesRepository.createVote(data);
  }

  @Get()
  async listVotes(): Promise<ListVotes> {
    return { votes: await this.votesRepository.getAllVotes() };
  }

  @Get(':voteId')
  async getVote(
    @Param('voteId', ParseIntPipe) voteId: number,
  ): Promise<GetVote> {
    return { vote: await this.votesRepository.getVoteById(voteId) };
  }

  @Post(':voteId/choice/vote')
  async choiceVote(
    @Param('voteId', ParseIntPipe) votedId: number,
    @Body('choicedId') choicedVoteId: number,
  ) {
    const userId = 2; // 임시
    console.log(votedId);
    console.log(choicedVoteId);

    const data: CreateVotedUserDto = {
      votedId: votedId,
      userId: userId,
      choicedVoteId: choicedVoteId,
    };

    return await this.votesService.choiceVote(data);
  }

  @Post(':voteId/like')
  async likeVote(@Param('voteId', ParseIntPipe) voteId: number) {
    const userId = 1;

    const data: LikesVoteDto = {
      voteId,
      userId,
    };

    const t = await this.votesService.likeVote(data);
    console.log(t);
    return;
  }

  @Get(':voteId/voted-users')
  async getVotedUsers(@Param('id', ParseIntPipe) voteId: number) {
    return this.votesRepository.getVotedUsers(voteId);
  }
}

@Controller('votes/:voteId/comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsRepository: CommentsRepository,
  ) {}

  @Get()
  async getVoteComments(@Param('voteId', ParseIntPipe) voteId: number) {
    return await this.commentsRepository.getAllVotes(voteId);
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
}