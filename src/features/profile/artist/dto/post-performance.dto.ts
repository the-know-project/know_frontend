import { z } from "zod";

export const PostPerformanceItemDto = z.object({
  title: z.string(),
  url: z.string().url(),
  fileId: z.string(),
  ordersCount: z.number(),
  commentCount: z.number(),
  createdAt: z.string(),
});

export const PostPerformanceMetaDto = z.object({
  currentPage: z.number(),
  totalPages: z.number(),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const PostPerformanceResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(PostPerformanceItemDto),
  meta: PostPerformanceMetaDto,
});

export const GetPostPerformanceParamsDto = z.object({
  userId: z.string().uuid(),
  page: z.number().int().positive(),
  limit: z.number().int().positive().max(100),
});

export type PostPerformanceResponse = z.infer<typeof PostPerformanceResponseDto>;
export type GetPostPerformanceParams = z.infer<typeof GetPostPerformanceParamsDto>;