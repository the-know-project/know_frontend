import { z } from "zod";
export const JoinCtaSchema = z.object({
  email: z.string().email(),
});

export type IJoinCtaSchema = z.infer<typeof JoinCtaSchema>;
