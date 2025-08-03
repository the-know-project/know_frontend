import { z } from "zod";

export const IncrementViewCountSchema = z.object({
  userId: z.string().uuid(),
  fileId: z.string(),
});
