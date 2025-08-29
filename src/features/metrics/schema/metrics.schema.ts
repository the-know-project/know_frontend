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
