import { Injectable } from '@nestjs/common';
import { PrismaClient, VoteComments, Votes } from '@prisma/client';
import {
  CreateVoteCommentDto,
  CreateVoteDto,
  CreateVotedUserDto,
  LikesVoteCommentDto,
  LikesVoteDto,
  UpdateVoteCommentDto,
  UpdateVoteDto,
  VotesEntity,
} from '@vote/common';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(VotesEntity)
export class VotesRepository_ extends Repository<VotesEntity> {}

@Injectable()
export class VotesRepository {
  private readonly prisma = new PrismaClient();

  async createVote(dto) {
    const { title, endDate, userId, voteChoices } = dto;

    return await this.prisma.votes.create({
      data: {
        title,
        endDate,
        writerId: userId,
        voteChoices: {
          create: voteChoices.map((value) => ({ title: value })),
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
            votedUsers: true,
            likedUsers: true,
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
        votedUsers: {
          select: {
            userId: true,
          },
        },
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
            votedUsers: true,
            likedUsers: true,
          },
        },
      },
    });
  }

  async updateVote(dto: UpdateVoteDto) {
    const { voteId, voteChoices, ...data } = dto;

    const updateVoteOperation = await this.prisma.votes.update({
      where: {
        id: voteId,
      },
      data: {
        ...data,
      },
    });

    return updateVoteOperation;
  }

  async deleteVote(voteId: number) {
    return await this.prisma.votes.delete({
      where: {
        id: voteId,
      },
    });
  }

  async createVotedUser({ voteId, userId, choicedVoteId }: CreateVotedUserDto) {
    return await this.prisma.votedUsers.create({
      data: {
        voteId,
        userId,
        voteChoiceId: choicedVoteId,
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
        writerId: userId,
      },
    });
  }

  async createLikedUser({ voteId, userId }: LikesVoteDto) {
    return await this.prisma.votes.update({
      where: {
        id: voteId,
      },
      data: {
        likedUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteLikedUser({ voteId, userId }: LikesVoteDto) {
    return await this.prisma.votes.update({
      where: {
        id: voteId,
      },
      data: {
        likedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async getLikedVoteByUserId(userId: number): Promise<Votes[]> {
    return this.prisma.votes.findMany({
      where: {
        writerId: userId,
      },
    });
  }
}

@Injectable()
export class CommentsRepository {
  private readonly prisma = new PrismaClient();

  async getAllVoteComments(voteId: number): Promise<VoteComments[]> {
    return await this.prisma.voteComments.findMany({
      where: {
        voteId,
      },
      include: {
        _count: {
          select: {
            likedUsers: true,
          },
        },
      },
    });
  }

  async getAllCommentsByUserId(userId: number): Promise<VoteComments[]> {
    return await this.prisma.voteComments.findMany({
      where: {
        writerId: userId,
      },
      include: {
        _count: {
          select: {
            likedUsers: true,
          },
        },
      },
    });
  }

  async createVoteComment({ content, voteId, userId }: CreateVoteCommentDto) {
    return await this.prisma.voteComments.create({
      data: {
        content,
        voteId,
        writerId: userId,
      },
    });
  }

  async updateVoteComment({ commentId, content }: UpdateVoteCommentDto) {
    return await this.prisma.voteComments.update({
      where: {
        id: commentId,
      },
      data: {
        content,
        isUpdated: true,
      },
    });
  }

  async deleteVoteComment(commentId: number) {
    return await this.prisma.voteComments.delete({
      where: {
        id: commentId,
      },
    });
  }

  async createLikedUser({ commentId, userId }: LikesVoteCommentDto) {
    return await this.prisma.voteComments.update({
      where: {
        id: commentId,
      },
      data: {
        likedUsers: {
          connect: {
            id: userId,
          },
        },
      },
    });
  }

  async deleteLikedUser({ commentId, userId }: LikesVoteCommentDto) {
    return await this.prisma.voteComments.update({
      where: {
        id: commentId,
      },
      data: {
        likedUsers: {
          disconnect: {
            id: userId,
          },
        },
      },
    });
  }

  async getLikedCommentsByUserId(userId: number): Promise<VoteComments[]> {
    return this.prisma.voteComments.findMany({
      where: {
        writerId: userId,
      },
    });
  }
}
