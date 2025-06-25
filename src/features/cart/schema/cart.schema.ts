import { z } from "zod";

export const AddToCartSchema = z.object({
  userId: z.string().uuid(),
  fileId: z.string(),
});
