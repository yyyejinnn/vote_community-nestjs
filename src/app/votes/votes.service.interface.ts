import { CreateVoteDto, UpdateVoteDto } from '@vote/common';

export interface VotesServiceInterface {
  listVotes();
  getVoteById(voteId: number);
  getAllVotesByUserId(userId: number);
  createVote(userId: number, dto: CreateVoteDto);
  updateVote(voteId: number, dto: UpdateVoteDto);
  deleteVote(voteId: number);
  choiceVote(choicedId: number, userId: number);
  likeVote(voteId: number, userId: number);
  cancleLikedVote(voteId: number, userId: number);
}
