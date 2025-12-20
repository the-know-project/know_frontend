import { z } from "zod";

export const FetchAllCollectionsDto = z.object({
  userId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
});
