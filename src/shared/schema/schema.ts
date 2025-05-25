import { z } from "zod";
export const JoinCtaSchema = z.object({
  email: z.string().email(),
});

export const IJoinCtaSchema = z.infer<typeof JoinCtaSchema>;
