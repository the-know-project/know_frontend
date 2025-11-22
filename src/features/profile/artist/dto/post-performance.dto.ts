// src/features/profile/artist/dto/post-performance.dto.ts
import { z } from "zod";

// Flexible schema to see what we're actually getting
export const PostPerformanceDto = z.object({
  id: z.string().optional(),
  postId: z.string().optional(),
  title: z.string().optional(),
  name: z.string().optional(),
  published: z.string().optional(),
  createdAt: z.string().optional(),
  publishedAt: z.string().optional(),
  src: z.string().url().optional(),
  imageUrl: z.string().url().optional(),
  image: z.string().url().optional(),
  views: z.number().optional(),
  viewCount: z.number().optional(),
  totalLikes: z.number().optional(),
  likes: z.number().optional(),
  likeCount: z.number().optional(),
  totalSales: z.number().optional(),
  sales: z.number().optional(),
  salesCount: z.number().optional(),
}).passthrough(); // Allow additional fields

export const PostPerformanceResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(PostPerformanceDto),
});