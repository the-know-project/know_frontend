import { z } from "zod";

export const CartData = z.object({
  id: z.string().uuid(),
  userId: z.string().uuid(),
  fileId: z.string(),
  quantity: z.number().min(1).max(100),
  price: z.number().min(0).max(1000),
  createdAt: z.number(),
  updatedAt: z.number(),
});

export const CartResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CartData),
});
