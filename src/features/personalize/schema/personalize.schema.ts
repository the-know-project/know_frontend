import { z } from "zod";

export const PersonalizeSchema = z.object({
  categories: z.array(z.string()),
});
