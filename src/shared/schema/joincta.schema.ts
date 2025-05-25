import { z } from "zod";
export const JoinCtaSchema = z.object({
  email: z.string().email(),
});

export type IJoinCta = z.infer<typeof JoinCtaSchema>;
