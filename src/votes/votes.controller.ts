import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { CreateVoteDto, CreateVotedUserDto } from 'src/common/dto/votes.dto';
import { GetVote, ListVotes } from 'src/common/interface/votes.interface';
import { VotesRepository } from './votes.repository';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    private readonly votesRepository: VotesRepository,
  ) {}

  @Post()
  async createVote(@Body() data: CreateVoteDto) {
    data['userId'] = 2; //임시
    return await this.votesService.createVote(data);
  }

  @Get()
  async listVotes(): Promise<ListVotes> {
    return { votes: await this.votesRepository.getAllVotes() };
  }

  @Get(':id')
  async getVote(@Param('id', ParseIntPipe) voteId: number): Promise<GetVote> {
    return { vote: await this.votesRepository.getVoteById(voteId) };
  }

  @Post(':id/choice/vote')
  async choiceVote(
    @Param('id', ParseIntPipe) votedId: number,
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
}
