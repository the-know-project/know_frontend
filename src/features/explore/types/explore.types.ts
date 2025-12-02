
import { z } from "zod";
import {
  FetchAssetSchema,
  LikeAssetSchema,
  AddCommentSchema,
  FetchCommentsSchema,
  HideCommentSchema,
  DeleteCommentSchema,
  CommentSchema,
  CommentMetaSchema,
  FetchCommentsResponseSchema,
  AddCommentResponseSchema,
  HideCommentResponseSchema,
  DeleteCommentResponseSchema,
} from "../schema/explore.schema";
import { Asset, FetchExploreAssetDto } from "../dto/explore.dto";


export type TFetchExploreAsset = z.infer<typeof FetchAssetSchema>;
export type TAsset = z.infer<typeof Asset>;
export type TLikeAsset = z.infer<typeof LikeAssetSchema>;
export type TExploreAssetDto = z.infer<typeof FetchExploreAssetDto>;


export type TAddComment = z.infer<typeof AddCommentSchema>;
export type TFetchComments = z.infer<typeof FetchCommentsSchema>;
export type THideComment = z.infer<typeof HideCommentSchema>;
export type TDeleteComment = z.infer<typeof DeleteCommentSchema>;


export type TComment = z.infer<typeof CommentSchema>;
export type TCommentMeta = z.infer<typeof CommentMetaSchema>;

export type TFetchCommentsResponse = z.infer<typeof FetchCommentsResponseSchema>;
export type TAddCommentResponse = z.infer<typeof AddCommentResponseSchema>;
export type THideCommentResponse = z.infer<typeof HideCommentResponseSchema>;
export type TDeleteCommentResponse = z.infer<typeof DeleteCommentResponseSchema>;