import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TagsEntity } from '@vote/common';
import { Repository } from 'typeorm';

@Injectable()
export class SearchService {
  constructor(
    @InjectRepository(TagsEntity)
    private readonly tagsRepository: Repository<TagsEntity>,
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
}
