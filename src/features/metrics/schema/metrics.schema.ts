import { z } from "zod";

export const IncrementViewCountSchema = z.object({
  fileId: z.string(),
});

export const SalesDurationSchema = z.enum(["YEARLY", "MONTHLY"]).optional();

export const FetchSalesDataSchema = z.object({
  duration: SalesDurationSchema,
});

export const FollowSchema = z.object({
  followingId: z.string().uuid(),
});

export const FetchUserFollowersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
});
