import { Injectable } from '@nestjs/common';
import { PrismaClient, VoteChoices, VoteComments, Votes } from '@prisma/client';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
} from '@vote/common';

@Injectable()
export class VotesRepository {
  private readonly prisma = new PrismaClient();

  async createVote(data: CreateVoteDto) {
    await this.prisma.votes.create({
      data: {
        title: data.title,
        user: {
          connect: {
            id: data.userId,
          },
        },
        voteChoices: {
          create: data.voteChoices.map((value) => ({ title: value })),
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
        _count: {
          select: {
            // 좋아요 수
            votedUsers: true,
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
          include: {
            _count: {
              select: {
                votedUsers: true,
              },
            },
          },
        },
        _count: {
          select: {
            // 좋아요 수
            votedUsers: true,
          },
        },
      },
    });
  }

  async createVotedUser(data: CreateVotedUserDto) {
    return await this.prisma.votedUsers.create({
      data: {
        vote: {
          connect: {
            id: data.votedId,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
        voteChoice: {
          connect: {
            id: data.choicedVoteId,
          },
        },
      },
    });
  }

  async getVotedUsers(voteId: number) {
    return await this.prisma.votedUsers.findMany({
      where: { voteId: voteId },
      select: {
        user: {
          select: {
            id: true,
            nickname: true,
          },
        },
      },
    });
  }

  async getAllVotesByUserId(userId: number): Promise<Votes[]> {
    return await this.prisma.votes.findMany({
      where: {
        userId,
      },
    });
  }
}

@Injectable()
export class CommentsRepository {
  private readonly prisma = new PrismaClient();

  async getAllVotes(voteId: number): Promise<VoteComments[]> {
    return await this.prisma.voteComments.findMany({
      where: {
        voteId,
      },
    });
  }

  async createVoteComment(data: CreateVoteCommentDto) {
    return await this.prisma.voteComments.create({
      data: {
        content: data.content,
        vote: {
          connect: {
            id: data.voteId,
          },
        },
        user: {
          connect: {
            id: data.userId,
          },
        },
      },
    });
  }
}
