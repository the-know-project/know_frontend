import { z } from "zod";

export const PersonalizeSchema = z.object({
  userId: z.string().uuid(),
  categories: z.array(z.string()),
});
