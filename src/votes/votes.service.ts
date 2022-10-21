import { Injectable } from '@nestjs/common';
import { CreateVotedUserDto, VotesException } from '@vote/common';
import { CustomException } from '@vote/middleware';
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
