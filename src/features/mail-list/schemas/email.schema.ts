import { z } from "zod";
export const EmailSchema = z.object({
  email: z.string().email({ message: "Not an email" }).toLowerCase(),
});

export const AddToMailListResponseDto = z.object({
  status: z.number(),
  message: z.string(),
});

export type IAddToMailList = z.infer<typeof EmailSchema>;
