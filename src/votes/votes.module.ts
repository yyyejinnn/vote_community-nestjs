import { forwardRef, Module } from '@nestjs/common';
import { UsersModule } from 'src/users/users.module';
import { VotesController } from './votes.controller';
import { VotesRepository } from './votes.repository';
import { VotesService } from './votes.service';

@Module({
  imports: [forwardRef(() => UsersModule)],
  controllers: [VotesController],
  providers: [VotesService, VotesRepository],
  exports: [VotesRepository],
})
export class VotesModule {}
