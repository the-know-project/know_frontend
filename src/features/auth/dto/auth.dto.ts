import { z } from "zod";

export const SignUpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: z.string().min(1).max(100).optional(),
});
