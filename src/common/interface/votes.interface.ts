import { Votes } from '@prisma/client';

export interface ListVotes {
  votes: Votes[];
}

export interface GetVote {
  vote: Votes;
}
