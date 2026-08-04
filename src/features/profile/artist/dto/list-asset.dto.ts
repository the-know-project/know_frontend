import { z } from "zod";

export const ListAssetDto = z.object({
  fileId: z.string(),
  price: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  currency: z.string(),
});
