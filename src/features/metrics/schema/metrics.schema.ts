import { z } from "zod";

export const IncrementViewCountSchema = z.object({
  userId: z.string().uuid(),
  fileId: z.string(),
});

export const SalesDurationSchema = z.enum(["YEARLY", "MONTHLY"]).optional();

export const FetchSalesDataSchema = z.object({
  userId: z.string().uuid(),
  duration: SalesDurationSchema,
});

export const FollowSchema = z.object({
  followerId: z.string().uuid(),
  followingId: z.string().uuid(),
});

export const FetchUserFollowersSchema = z.object({
  userId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
