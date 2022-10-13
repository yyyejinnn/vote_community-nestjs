import { Injectable } from '@nestjs/common';
import { PrismaClient, Votes } from '@prisma/client';
import { CreateVoteDto } from 'src/common/dto/votes.dto';

@Injectable()
export class VotesRepository {
  private readonly prisma = new PrismaClient();

  async createVote(data: CreateVoteDto, voteOpsionsArr: { title: string }[]) {
    await this.prisma.votes.create({
      data: {
        title: data.title,
        user: {
          connect: {
            id: data.userId,
          },
        },
        voteOption: {
          create: voteOpsionsArr,
        },
      },
    });
  }

  async listVotes(): Promise<Votes[]> {
    return await this.prisma.votes.findMany({
      include: {
        voteOption: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getVote(voteId: number): Promise<Votes> {
    return await this.prisma.votes.findFirst({
      where: {
        id: voteId,
      },
      include: {
        voteOption: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }
}
