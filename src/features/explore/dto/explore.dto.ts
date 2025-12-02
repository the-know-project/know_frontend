import { z } from "zod";

export const Asset = z.object({
  fileId: z.string(),
  fileName: z.string(),
  userId: z.string().uuid(),
  imageUrl: z.string().url(),
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  price: z.number().min(0),
  availability: z.boolean(),
  categories: z.array(z.string()).min(1),
  createdAt: z.date(),
  isListed: z.boolean(),
  isLocked: z.boolean(),
  url: z.string().url(),
  description: z.string().nullable(),
  size: z.object({
    width: z.number(),
    height: z.number(),
    weight: z.number(),
    depth: z.number().optional(),
    diameter: z.number().optional(),
    length: z.number().optional(),
    weightUnit: z.string().optional(),
    dimensionUnit: z.string().optional(),
  }),
  numOfLikes: z.number().min(0),
  numOfViews: z.number().min(0),
  tags: z.array(z.string()).optional(),
});

export const Pagination = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1).max(100),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const Filters = z.object({
  categories: z.string().optional(),
  priceRange: z.nullable(z.tuple([z.number().min(0), z.number().min(0)])),
  sortBy: z.string(),
  available: z.boolean().optional(),
});

export const FetchExploreAssetDto = z.object({
  status: z.number().min(0).max(1),
  data: z.object({
    assets: z.array(Asset),
    pagination: Pagination,
    filters: Filters,
  }),
});

export const AddCommentDto = z.object({
  userId: z.string(),
  fileId: z.string(),
  comment: z.string().min(1).max(1000),
});

export const FetchCommentsDto = z.object({
  fileId: z.string(),
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
});

export const HideCommentDto = z.object({
  userId: z.string(),
  commentId: z.string(),
});

export const DeleteCommentDto = z.object({
  userId: z.string(),
  commentId: z.string(),
});

export const CommentDto = z.object({
  id: z.string(),
  userId: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().url(),
  comment: z.string(),
  createdAt: z.string(),
});

export const CommentMetaDto = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const FetchCommentsResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CommentDto),
  meta: CommentMetaDto,
});

export const CommentActionResponseDto = z.object({
  status: z.number(),
  message: z.string(),
});