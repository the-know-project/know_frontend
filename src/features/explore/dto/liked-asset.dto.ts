import { z } from "zod";

export const FetchLikeAssetDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(z.string()),
});
