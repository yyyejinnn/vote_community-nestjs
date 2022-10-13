import { Injectable } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateVoteDto } from 'src/common/dto/votes.dto';

@Injectable()
export class VotesRepository {
  private readonly prisma = new PrismaClient();

  async createVote(data: CreateVoteDto) {
    const { voteOptions, ...vote } = data;
    const voteOpsionsTitles = voteOptions.map((value) => ({
      title: value,
    }));

    await this.prisma.votes.create({
      data: {
        title: vote.title,
        user: {
          connect: {
            id: vote.userId,
          },
        },
        voteOption: {
          create: voteOpsionsTitles,
        },
      },
    });
  }
}
