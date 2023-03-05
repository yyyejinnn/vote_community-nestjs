import { PartialType } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

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

export class UpdateVoteCommentDto extends PartialType(CreateVoteCommentDto) {}
