import {
  Body,
  Controller,
  Get,
  Param,
  ParseIntPipe,
  Post,
} from '@nestjs/common';
import { Votes } from '@prisma/client';
import { CreateVoteDto } from 'src/common/dto/votes.dto';
import { GetVote, ListVotes } from 'src/common/interface/votees.interface';
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
    return { votes: await this.votesRepository.listVotes() };
  }

  @Get(':id')
  async getVote(@Param('id', ParseIntPipe) voteId: number): Promise<GetVote> {
    return { vote: await this.votesRepository.getVote(voteId) };
  }
}
