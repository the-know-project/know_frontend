import { z } from "zod";

export const CartData = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  userId: z.string().uuid(),
  fileId: z.string(),
  quantity: z.number().min(1).max(100),
  price: z.number().min(0).max(1000),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CartResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CartData).optional(),
});
