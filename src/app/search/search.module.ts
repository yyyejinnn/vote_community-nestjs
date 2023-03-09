import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TagsEntity } from '@vote/common';
import { SearchController } from './search.controller';
import { SearchService } from './search.service';

@Module({
  imports: [TypeOrmModule.forFeature([TagsEntity])],
  controllers: [SearchController],
  providers: [SearchService],
  exports: [TypeOrmModule],
})
export class SearchModule {}
