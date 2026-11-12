import { z } from "zod";

export const DeleteAssetDto = z.object({
  fileId: z.string(),
});
