import { z } from "zod";

const UploadData = z.object({
  id: z.string(),
  fileName: z.string(),
  url: z.string(),
});

export const UploadResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: UploadData.optional(),
});
