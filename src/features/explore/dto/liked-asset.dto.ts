import { z } from "zod";

const LikeResponseData = z.object({
  fileId: z.string(),
  numOfLikes: z.number(),
});

export const FetchLikeAssetDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(LikeResponseData),
});
