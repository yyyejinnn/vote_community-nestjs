import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateVoteDto, CreateVotedUserDto } from 'src/common/dto/votes.dto';
import { VotesException } from 'src/common/interface/exception';
import { CustomException } from 'src/common/middleware/http-exception.filter';
import { VotesRepository } from './votes.repository';

@Injectable()
export class VotesService {
  constructor(private readonly votesRepository: VotesRepository) {}

  async choiceVote(data: CreateVotedUserDto) {
    try {
      return await this.votesRepository.createVotedUser(data);
    } catch (error) {
      throw new CustomException(VotesException.ALREADY_VOTED);
    }
  }
}
