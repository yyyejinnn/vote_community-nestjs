import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateVoteDto } from 'src/common/dto/votes.dto';
import { VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async createVote(data: CreateVoteDto) {
    const { voteChoices } = data;
    const voteChoicesArr = voteChoices.map((value) => ({
      title: value,
    }));

    return await this.votesRepository.createVote(data, voteChoicesArr);
  }
}
