import { Controller, Get, Inject, Query } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchServiceInterface } from './search.service.interface';

@Controller('search')
export class SearchController {
  constructor(
    @Inject('SEARCH_SERVICE')
    private readonly searchService: SearchServiceInterface,
  ) {}

  @Get()
  async searchByTag(@Query('tag') tag: string) {
    return {
      votes: await this.searchService.searchByTag(tag),
    };
  }

  @Get()
  async sortVotes(@Query('sorting') sorting, @Query('order') order) {
    return {
      votes: await this.searchService.sortVotes(sorting, order),
    };
  }
}
