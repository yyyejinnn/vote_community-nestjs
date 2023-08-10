import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChoicedUsersEntity,
  CreateVoteDto,
  TagsEntity,
  UpdateVoteDto,
  UsersEntity,
  VoteChoicesEntity,
  VotedUsersEntity,
  VotesEntity,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UsersServiceInterface } from '../users/users.service.interface';
import { VotesServiceInterface } from './votes.service.interface';

@Injectable()
export class VotesService implements VotesServiceInterface {
  constructor(
    @InjectRepository(VotesEntity)
    private readonly votesRepository: Repository<VotesEntity>,
    @InjectRepository(VoteChoicesEntity)
    private readonly choicesRepository: Repository<VoteChoicesEntity>,
    @InjectRepository(ChoicedUsersEntity)
    private readonly choicedRepository: Repository<ChoicedUsersEntity>,
    @InjectRepository(VotedUsersEntity)
    private readonly votedRepository: Repository<VotedUsersEntity>,
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) { }

  async listVotes() {
    return await this.votesRepository.find();
  }

  async getVoteById(voteId: number) {
    return await this.votesRepository.findOne({
      where: {
        id: voteId,
      },
    });
  }

  async getAllVotesByUserId(userId: number) {
    return await this.votesRepository.find({
      where: {
        writerId: userId,
      },
    });
  }

  async createVote(userId: number, dto: CreateVoteDto) {
    const { title, endDate, voteChoices, tags } = dto;
    this._compareDates(endDate);

    const writer = await this.usersRepository.findOne({
      where: { id: userId }
    });

    // connect tags
    const savedTags = await Promise.all(
      tags.map((name) => {
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

    const voteEntity = this.votesRepository.create({
      title,
      endDate,
      writer,
      voteChoices: voteChoices.map((value) => {
        const choiceEntity = new VoteChoicesEntity();
        choiceEntity.title = value;
        return choiceEntity;
      }),
      tags: savedTags,
    });

    return await this.votesRepository.save(voteEntity);
  }

  async updateVote(voteId: number, { endDate }: UpdateVoteDto) {
    this._compareDates(endDate);

    await this.votesRepository.update(voteId, {
      endDate,
    });
  }

  async deleteVote(voteId: number) {
    const result = await this.votesRepository.delete(voteId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async choiceVote(choicedId: number, userId: number) {
    const user = await this.usersRepository.findOne({
      where: { id: userId }
    });

    // voted 생성
    const vote = await this.votesRepository.findOne({
      where: {
        voteChoices: {
          id: choicedId,
        },
      },
    });
    const voted = new VotedUsersEntity();
    voted.vote = vote;
    voted.user = user;
    await this.votedRepository.save(voted);

    // choiced 생성
    const choice = await this.choicesRepository.findOne({
      where: {
        id: choicedId,
      },
    });
    const choiced = new ChoicedUsersEntity();
    choiced.choice = choice;
    choiced.user = user;
    await this.choicedRepository.save(choiced);
  }

  async likeVote(voteId: number, userId: number) {
    const likedUser = await this.usersRepository.findOne({
      where: { id: userId }
    });

    const vote = await this.votesRepository.findOne({
      where: {
        id: voteId,
      },
    });
    vote.likedUsers.push(likedUser);

    await this.votesRepository.save(vote);
  }

  async cancleLikedVote(voteId: number, userId: number) {
    const vote = await this.votesRepository.findOne({
      where: {
        id: voteId,
      },
    });

    vote.likedUsers = vote.likedUsers.filter((user) => {
      return user.id !== userId;
    });

    await this.votesRepository.save(vote);
  }

  private _compareDates(endDate: Date | string) {
    const date = new Date(endDate);
    const now = new Date();

    if (now >= date) {
      throw new CustomException(VotesException.END_DATE_LTE_TO_NOW);
    }
  }
}
