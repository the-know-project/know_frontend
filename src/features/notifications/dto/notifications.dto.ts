import { z } from "zod";

const NotificationData = z.object({
  userId: z.string().uuid(),
  id: z.string().uuid(),
  image: z.string().url().optional(),
  type: z.string().min(1).max(255),
  content: z.string().min(1).max(255),
  createdAt: z.number(),
});

export const NotificationResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(NotificationData).optional(),
});
