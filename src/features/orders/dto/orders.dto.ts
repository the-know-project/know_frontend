import { z } from "zod";

export const OrderItems = z.object({
  fileId: z.string(),
  name: z.string(),
  price: z.number(),
  quantity: z.number().min(1),
  userId: z.string().uuid(), // this is the id of the artist who owns the artist
});

export const CreateOrderDto = z.object({
  userId: z.string().uuid(),
  items: z.array(OrderItems),
});
