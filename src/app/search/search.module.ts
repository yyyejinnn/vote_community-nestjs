import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity, VotesEntity } from '@vote/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagsEntity, VotesEntity])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [TypeOrmModule],
})
export class SearchModule {}
