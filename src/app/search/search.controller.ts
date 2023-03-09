import { Controller, Get, Query } from '@nestjs/common';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get()
  async searchByTag(@Query('tag') tag: string) {
    return {
      votes: await this.searchService.searchByTag(tag),
    };
  }
}
