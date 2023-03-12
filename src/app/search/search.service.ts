import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsEntity, VotesEntity } from '@vote/common';
import { FindManyOptions, FindOptionsOrderValue, Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
    @InjectRepository(VotesEntity)
    private readonly votesRepository: Repository<VotesEntity>,
  ) {}

  async searchByTag(tagName: string) {
    return await this.tagsRepository.find({
      where: {
        name: tagName,
      },
      relations: {
        votes: true,
      },
    });
  }

  async sortVotes(sorting: string, order: 'asc' | 'desc') {
    let orderOpiton: FindManyOptions<VotesEntity>;

    switch (sorting) {
      case 'title':
        orderOpiton = {
          order: {
            title: order,
          },
        };
      case 'createdAt':
        orderOpiton = {
          order: {
            createdAt: order,
          },
        };
      case 'endDate': {
        orderOpiton = {
          order: {
            endDate: order,
          },
        };
      }
    }

    return await this.votesRepository.find(orderOpiton);
  }
}
