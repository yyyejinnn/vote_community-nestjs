import { PartialType } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsDate, IsNotEmpty, IsString } from 'class-validator';

export class CreateVoteDto {
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
}

export class CreateVoteCommentDto {
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
}

export class UpdateVoteDto extends PartialType(CreateVoteDto) {}

export class CreateVotedUserDto {
  @IsNotEmpty({
    context: {
      code: 'EMPTY_CHOICED_VOTE_ID',
    },
  })
  @Type(() => Number)
  choicedVoteId: number;
}

export class UpdateVoteCommentDto extends PartialType(CreateVoteCommentDto) {}
