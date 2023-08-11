import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
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
    // @InjectRepository(ChoicedUsersEntity)
    // private readonly choicedRepository: Repository<ChoicedUsersEntity>,
    @InjectRepository(VotedUsersEntity)
    private readonly votedRepository: Repository<VotedUsersEntity>,
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
  ) {
  }

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

  /****** create Vote */
  async createVote(userId: number, dto: CreateVoteDto) {
    const { title, endDate, voteChoices, tags } = dto;

    this._compareDates(endDate);

    const writer = await this.usersRepository.findOne({ where: { id: userId } });

    const voteEntity = this.votesRepository.create({
      title,
      endDate,
      writer,
      voteChoices: await this.getChoiceEntities(voteChoices),
      tags: await this.getTagEntities(tags),
    });

    return await this.votesRepository.save(voteEntity);
  }

  private voteChoiceEntityFor(title: string) {
    return this.choicesRepository.create({ title });
  }

  private async getTagEntities(tags: string[]) {
    return Promise.all(tags.map(name => this.tagEntityFor(name)));
  }

  private async getChoiceEntities(voteChoices: string[]) {
    return Promise.all(voteChoices.map(value => this.voteChoiceEntityFor(value)));
  }

  private async tagEntityFor(name: string) {
    const originName = name;

    const tag = await this.tagsRepository.findOne({ where: { name: formedName() } });

    if (tag == null) {
      return this.tagsRepository.create({ name: formedName() });
    }

    return tag;

    function formedName() {
      return originName.toUpperCase().replace(/ /g, "");
    };
  }


  /****** */
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
    await this.choicesRepository
      .createQueryBuilder()
      .relation('choicedUsers')
      .of(choicedId)
      .add(userId);
  }

  async likeVote(voteId: number, userId: number) {
    await this.votesRepository
      .createQueryBuilder()
      .relation('likedUsers')
      .of(voteId)
      .add(userId);
  }

  async cancleLikedVote(voteId: number, userId: number) {
    await this.votesRepository
      .createQueryBuilder()
      .relation('likedUsers')
      .of(voteId)
      .remove(userId);
  }

  private _compareDates(endDate: Date | string) {
    const date = new Date(endDate);
    const now = new Date();

    if (now >= date) {
      throw new CustomException(VotesException.END_DATE_LTE_TO_NOW);
    }
  }
}
