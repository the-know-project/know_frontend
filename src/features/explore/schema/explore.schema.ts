import { z } from "zod";


export const FetchAssetSchema = z.object({
  userId: z.string().uuid().optional(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  categories: z.array(z.string()).optional(),
  priceMin: z.number().min(0).optional(),
  priceMax: z.number().min(0).optional(),
  sortBy: z.enum(["latest", "oldest"]).optional(),
  available: z.boolean().optional(),
});

export const LikeAssetSchema = z.object({
  userId: z.string().uuid(),
  fileId: z.string().uuid(),
});


export const AddCommentSchema = z.object({
  userId: z.string(),
  fileId: z.string(),
  comment: z.string().min(1, "Comment cannot be empty").max(1000, "Comment is too long"),
});

export const FetchCommentsSchema = z.object({
  fileId: z.string(),
  page: z.number().min(1).optional().default(1),
  limit: z.number().min(1).max(100).optional().default(10),
});

export const HideCommentSchema = z.object({
  userId: z.string(),
  commentId: z.string(),
});

export const DeleteCommentSchema = z.object({
  userId: z.string(),
  commentId: z.string(),
});

export const CommentSchema = z.object({
  id: z.string(),
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().url(),
  comment: z.string(),
  createdAt: z.string(),
});

export const CommentMetaSchema = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});


export const FetchCommentsResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CommentSchema),
  meta: CommentMetaSchema,
});

export const AddCommentResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export const HideCommentResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});

export const DeleteCommentResponseSchema = z.object({
  status: z.number(),
  message: z.string(),
});