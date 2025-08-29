import { z } from "zod";

export const IncrementViewCountSchema = z.object({
  userId: z.string().uuid(),
  fileId: z.string(),
});

export const FetchSalesDataSchema = z.object({
  userId: z.string().uuid(),
  duration: z.enum(["YEARLY", "MONTHLY"]).optional(),
});
