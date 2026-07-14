import { z } from "zod";

export const CartData = z.object({
  id: z.string().uuid(),
  url: z.string().url(),
  highResUrl: z.string().url(),
  title: z.string(),
  userId: z.string().uuid(),
  artistId: z.string().uuid(),
  artistFirstName: z.string(),
  artistLastName: z.string(),
  artistProfilePicture: z.string().nullable(),
  viewCount: z.number().nullable(),
  fileId: z.string(),
  quantity: z.number().min(1).max(100),
  price: z.number().min(0).max(1000),
  size: z.object({
    width: z.number(),
    height: z.number(),
    weight: z.number(),
    depth: z.number().optional(),
    diameter: z.number().optional(),
    length: z.number().optional(),
    weightUnit: z.string().optional(),
    dimensionUnit: z.string().optional(),
    aspectRatio: z.string().optional(),
  }),
  tags: z.array(z.string()).optional(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const CartResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CartData).optional(),
});
