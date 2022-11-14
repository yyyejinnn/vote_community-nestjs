import { OmitType, PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNotEmpty()
  endDate: Date;

  @IsArray()
  @IsNotEmpty()
  voteChoices: string[];

  @Type(() => Number)
  userId: number;
}

export class UpdateVoteDto extends PartialType(
  OmitType(CreateVoteDto, ['userId']),
) {
  voteId: number;
}

export class CreateVotedUserDto {
  votedId: number;
  userId: number;
  choicedVoteId: number;
}

export class CreateVoteCommentDto {
  voteId: number;
  userId: number;
  content: string;
}

export class UpdateVoteCommentDto extends PartialType(
  OmitType(CreateVoteCommentDto, ['userId', 'voteId']),
) {
  commentId: number;
}

export class LikesVoteDto {
  voteId: number;
  userId: number;
}

export class LikesVoteCommentDto {
  commentId: number;
  userId: number;
}
