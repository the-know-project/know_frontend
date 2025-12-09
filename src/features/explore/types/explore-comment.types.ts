import { z } from 'zod';
import { exploreComment, meta, comments } from '../dto/explore-comment.dto';

export type TExploreComment = z.infer<typeof exploreComment>;
export type TMeta = z.infer<typeof meta>;
export type TComments = z.infer<typeof comments>;


export type AddCommentPayload = {
  postId: string;
  comment: string;
  fileId?: string;
};

export type DeleteCommentPayload = {
  commentId: string;
  postId: string;
};

export type HideCommentPayload = {
  commentId: string;
  postId: string;
};

export type UpdateCommentPayload = {
  commentId: string;
  postId: string;
  content: string;
};