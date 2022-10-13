import { Body, Controller, Get, Post } from '@nestjs/common';
import { CreateVoteDto } from 'src/common/dto/votes.dto';
import { VotesRepository } from './votes.repository';
import { VotesService } from './votes.service';

@Controller('votes')
export class VotesController {
  constructor(
    private readonly votesService: VotesService,
    private readonly votesRepositoyr: VotesRepository,
  ) {}

  @Post()
  createVote(@Body() data: CreateVoteDto) {
    data['userId'] = 2; //임시
    return this.votesService.createVote(data);
  }

  @Get()
  listVotes() {
    console.log('get-all-votes');
  }

  @Get(':id')
  getVote() {
    console.log('get-vote');
  }
}
