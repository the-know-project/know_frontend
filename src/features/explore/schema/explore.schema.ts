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
