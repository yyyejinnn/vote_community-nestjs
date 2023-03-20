import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentsEntity } from '../comments.entity';
import { UsersEntity } from '../users.entity';
import { VotesEntity } from '../votes.entity';

@Injectable()
export class CommentsMapper {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(VotesEntity)
    private readonly votesRepository: Repository<VotesEntity>,
  ) {}

  async createCommentsEntity(voteId: number, userId: number, content: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
    });

    const vote = await this.votesRepository.findOne({
      where: {
        id: voteId,
      },
    });

    const entity = new CommentsEntity();
    entity.content = content;
    entity.writer = user;
    entity.vote = vote;

    return entity;
  }
}
