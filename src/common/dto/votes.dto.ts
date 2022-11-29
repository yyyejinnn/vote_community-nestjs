import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

class VotesDto {
  @IsNotEmpty()
  @Type(() => Number)
  voteId: number;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDate()
  @IsNotEmpty()
  endDate: Date;

  @IsArray()
  @IsNotEmpty()
  voteChoices: string[];

  @IsNotEmpty()
  @Type(() => Number)
  userId: number;
}

class VoteCommentsDto {
  @IsNotEmpty()
  @Type(() => Number)
  commentId: number;

  @IsString()
  @IsNotEmpty()
  content: string;

  @IsNotEmpty()
  @Type(() => Number)
  userId: number;

  @IsNotEmpty()
  @Type(() => Number)
  voteId: number;
}

export class CreateVoteDto extends OmitType(VotesDto, ['voteId']) {}

export class UpdateVoteDto extends PartialType(
  OmitType(VotesDto, ['userId']),
) {}

export class CreateVotedUserDto extends PickType(VotesDto, [
  'voteId',
  'userId',
]) {
  @IsNotEmpty()
  @Type(() => Number)
  choicedVoteId: number;
}

export class CreateVoteCommentDto extends OmitType(VoteCommentsDto, [
  'commentId',
]) {}

export class UpdateVoteCommentDto extends PartialType(
  PickType(VoteCommentsDto, ['commentId', 'content']),
) {}

export class LikesVoteDto extends PickType(VotesDto, ['voteId', 'userId']) {}

export class LikesVoteCommentDto extends PickType(VoteCommentsDto, [
  'commentId',
  'userId',
]) {}
