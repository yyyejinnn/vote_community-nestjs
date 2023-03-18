import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersEntity } from '../users.entity';
import {
  ChoicedUsersEntity,
  TagsEntity,
  VoteChoicesEntity,
  VotedUsersEntity,
  VotesEntity,
} from '../votes.entity';

@Injectable()
export class VotesMapper {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(VotesEntity)
    private readonly votesRepository: Repository<VotesEntity>,
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(VoteChoicesEntity)
    private readonly choicesRepository: Repository<VoteChoicesEntity>,
  ) {}

  async createVoteEntity(
    title?: string,
    endDate?: string,
    voteChoices?: string[],
    tags?: string[],
    writerId?: number,
  ) {
    const vote = new VotesEntity();
    if (title) vote.title = title;
    if (endDate) vote.endDate = new Date(endDate);
    if (voteChoices)
      vote.voteChoices = await this._choicesToEntity(voteChoices);
    if (tags) vote.tags = await this._tagsToEntity(tags);
    if (writerId)
      vote.writer = await this.usersRepository.findOne({
        where: {
          id: writerId,
        },
      });

    return vote;
  }

  protected async _choicesToEntity(
    voteChoices: string[],
  ): Promise<VoteChoicesEntity[]> {
    return voteChoices.map((value) => {
      const choiceEntity = new VoteChoicesEntity();
      choiceEntity.title = value;
      return choiceEntity;
    });
  }

  protected async _tagsToEntity(tagNames: string[]): Promise<TagsEntity[]> {
    return await Promise.all(
      tagNames.map((name) => {
        const result = this.tagsRepository
          .findOne({
            where: {
              name,
            },
          })
          .then((value) => {
            if (!value) {
              const tagEntity = new TagsEntity();
              tagEntity.name = name;
              return tagEntity;
            } else {
              return value;
            }
          });

        return result;
      }),
    );
  }

  async createVotedUsersEntity(choicedId, userId) {
    const vote = await this.votesRepository.findOne({
      where: {
        voteChoices: {
          id: choicedId,
        },
      },
    });

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const votedEntity = new VotedUsersEntity();
    votedEntity.vote = vote;
    votedEntity.user = user;

    return votedEntity;
  }

  async createChoicedUsersEntity(choicedId, userId) {
    const choice = await this.choicesRepository.findOne({
      where: {
        id: choicedId,
      },
    });

    const user = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const choicedEntity = new ChoicedUsersEntity();
    choicedEntity.choice = choice;
    choicedEntity.user = user;

    return choicedEntity;
  }
}
