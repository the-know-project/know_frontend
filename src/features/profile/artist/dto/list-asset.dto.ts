import { z } from "zod";

export const ListAssetDto = z.object({
  fileId: z.string(),
  price: z.string(),
  currency: z.string(),
});
