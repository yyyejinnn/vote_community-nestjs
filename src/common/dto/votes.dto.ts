import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsString } from 'class-validator';

export class CreateVoteDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsArray()
  @IsNotEmpty()
  voteChoices: string[];

  @Type(() => Number)
  userId: number;
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

export class LikesVoteDto {
  voteId: number;
  userId: number;
}

export class LikesVoteCommentDto {
  commentId: number;
  userId: number;
}
