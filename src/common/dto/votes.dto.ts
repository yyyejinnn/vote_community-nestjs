import { OmitType, PartialType, PickType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

class VotesDto {
  @IsNotEmpty({
    context: {
      code: 'EMPTY_VOTE_ID',
    },
  })
  @Type(() => Number)
  voteId: number;

  @IsString({
    context: {
      code: 'MUST_STRING_TYPE',
    },
  })
  @IsNotEmpty({
    context: {
      code: 'EMPTY_TITLE',
    },
  })
  title: string;

  @IsNotEmpty({
    context: {
      code: 'EMPTY_END_DATE',
    },
  })
  endDate: Date;

  @IsArray({
    context: {
      code: 'MUST_ARRAY_TYPE',
    },
  })
  @IsNotEmpty({
    context: {
      code: 'EMPTY_VOTE_CHOICES',
    },
  })
  voteChoices: string[];

  @IsNotEmpty({
    context: {
      code: 'EMPTY_USER_ID',
    },
  })
  @Type(() => Number)
  userId: number;
}

class VoteCommentsDto {
  @IsNotEmpty({
    context: {
      code: 'EMPTY_NICKNAME',
    },
  })
  @Type(() => Number)
  commentId: number;

  @IsString({
    context: {
      code: 'MUST_STRING_TYPE',
    },
  })
  @IsNotEmpty({
    context: {
      code: 'EMPTY_CONTENT',
    },
  })
  content: string;

  @IsNotEmpty({
    context: {
      code: 'EMPTY_USER_ID',
    },
  })
  @Type(() => Number)
  userId: number;

  @IsNotEmpty({
    context: {
      code: 'EMPTY_VOTE_ID',
    },
  })
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
  @IsNotEmpty({
    context: {
      code: 'EMPTY_CHOICED_VOTE_ID',
    },
  })
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
