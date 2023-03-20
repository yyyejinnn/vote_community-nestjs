import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import {
  CreateVoteCommentDto,
  UpdateVoteCommentDto,
  UsersEntity,
} from '@vote/common';
import { CommentsEntity } from 'src/common/entity/comments.entity';
import { CommentsMapper } from 'src/common/entity/mapper/comments.mapper';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { UsersServiceInterface } from '../users/users.service.interface';
import { VotesService } from '../votes/votes.service';
import { VotesServiceInterface } from '../votes/votes.service.interface';
import { CommentsServiceInterface } from './comments.service.interface';

@Injectable()
export class CommentsService implements CommentsServiceInterface {
  constructor(
    @InjectRepository(UsersEntity)
    private readonly usersRepository: Repository<UsersEntity>,
    @InjectRepository(CommentsEntity)
    private readonly commentsRepository: Repository<CommentsEntity>,
    private readonly commentsMapper: CommentsMapper,
  ) {}

  async getAllVoteComments(voteId: number) {
    return await this.commentsRepository.find({
      where: {
        voteId,
      },
    });
  }

  async getAllCommentsByUserId(userId: number) {
    return await this.commentsRepository.find({
      where: {
        writerId: userId,
      },
    });
  }

  async createVoteComment(
    voteId: number,
    userId: number,
    { content }: CreateVoteCommentDto,
  ) {
    const entity = await this.commentsMapper.createCommentsEntity(
      voteId,
      userId,
      content,
    );

    return await this.commentsRepository.save(entity);
  }

  async updateVoteComment(
    commentId: number,
    { content }: UpdateVoteCommentDto,
  ) {
    await this.commentsRepository.update(commentId, {
      content,
      isUpdate: true,
    });
  }

  async deleteVoteComment(commentId: number) {
    const result = await this.commentsRepository.delete(commentId);

    if (result.affected === 0) {
      throw new NotFoundException('존재하지 않은 레코드');
    }
  }

  async likeVoteComment(commentId: number, userId: number) {
    const likedUser = await this.usersRepository.findOne({
      where: {
        id: userId,
      },
    });

    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    comment.likedUsers.push(likedUser);

    await this.commentsRepository.save(comment);
  }

  async cancleLikedVoteComment(commentId: number, userId: number) {
    const comment = await this.commentsRepository.findOne({
      where: {
        id: commentId,
      },
    });
    comment.likedUsers = comment.likedUsers.filter((user) => {
      return user.id !== userId;
    });

    await this.commentsRepository.save(comment);
  }
}
