import { z } from "zod";
import { exploreComment, meta, comments } from "../dto/explore-comment.dto";

export type TExploreComment = z.infer<typeof exploreComment>;
export type TMeta = z.infer<typeof meta>;
export type TComments = z.infer<typeof comments>;
export type IPostComment = z.infer<typeof AddCommentPayload>;
export type IDeleteComment = z.infer<typeof DeleteCommentPayload>;
export type IHideComment = z.infer<typeof DeleteCommentPayload>;

export const AddCommentPayload = z.object({
  userId: z.string(),
  fileId: z.string(),
  comment: z.string(),
});

export const DeleteCommentPayload = z.object({
  fileId: z.string().optional(),
  userId: z.string(),
  commentId: z.string(),
});

export type UpdateCommentPayload = {
  commentId: string;
  postId: string;
  content: string;
};

export interface IFetchPostComments {
  fileId: string;
  page?: number;
  limit?: number;
}
