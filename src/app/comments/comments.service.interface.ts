import { CreateVoteCommentDto, UpdateVoteCommentDto } from '@vote/common';

export interface CommentsServiceInterface {
  getAllVoteComments(voteId: number);
  getAllCommentsByUserId(userId: number);
  createVoteComment(voteId: number, userId: number, dto: CreateVoteCommentDto);
  updateVoteComment(commentId: number, dto: UpdateVoteCommentDto);
  deleteVoteComment(commentId: number);
  likeVoteComment(commentId: number, userId: number);
  cancleLikedVoteComment(commentId: number, userId: number);
}
