import { z } from "zod";
export const EmailSchema = z.object({
  email: z.string().email({ message: "Not an email" }),
});

export type IAddToMailList = z.infer<typeof EmailSchema>;
