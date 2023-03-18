import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  ChoicedUsersEntity,
  CreateVoteDto,
  TagsEntity,
  UpdateVoteDto,
  VoteChoicesEntity,
  VotedUsersEntity,
  VotesEntity,
} from '@vote/common';
import { CustomException, VotesException } from '@vote/middleware';
import { VotesMapper } from 'src/common/entity/mapper/votes.mapper';
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
    @Inject('USERS_SERVICE')
    private readonly usersService: UsersServiceInterface,
    private readonly votesMapper: VotesMapper,
  ) {}

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

    const voteEntity = await this.votesMapper.createVoteEntity(
      title,
      endDate,
      voteChoices,
      tags,
      userId,
    );

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
    // voted 생성
    const votedEntity = await this.votesMapper.createVotedUsersEntity(
      choicedId,
      userId,
    );

    // choiced 생성
    const choicedEntity = await this.votesMapper.createChoicedUsersEntity(
      choicedId,
      userId,
    );

    // 저장
    await this.votedRepository.save(votedEntity);
    await this.choicedRepository.save(choicedEntity);
  }

  async likeVote(voteId: number, userId: number) {
    const likedUser = await this.usersService.findUserByWhereOption({
      id: userId,
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
