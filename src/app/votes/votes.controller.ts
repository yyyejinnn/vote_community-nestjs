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
import { CreateVoteDto, UpdateVoteDto } from '@vote/common';
import { VotesService } from './votes.service';

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

  @Post('choice/:choicedId')
  async choiceVote(@Param('choicedId', ParseIntPipe) choicedId: number) {
    const userId = 2; // 임시
    console.log(choicedId);

    await this.votesService.choiceVote(choicedId, userId);
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
