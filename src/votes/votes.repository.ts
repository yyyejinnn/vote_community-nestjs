import { Injectable } from '@nestjs/common';
import { PrismaClient, Votes } from '@prisma/client';
import { title } from 'process';
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
        voteChoices: {
          create: voteOpsionsArr,
        },
      },
    });
  }

  async getAllVotes(): Promise<Votes[]> {
    return await this.prisma.votes.findMany({
      include: {
        voteChoices: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    });
  }

  async getVoteById(voteId: number): Promise<Votes> {
    return await this.prisma.votes.findFirst({
      where: {
        id: voteId,
      },
      include: {
        voteChoices: {
          select: {
            id: true,
            title: true,
          },
        },
        votedUsers: {
          include: {
            user: {
              select: {
                nickname: true,
              },
            },
          },
        },
      },
    });
  }
}
