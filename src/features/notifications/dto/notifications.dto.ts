import { z } from "zod";

export const NotificationData = z.object({
  userId: z.string().uuid(),
  id: z.string().uuid(),
  image: z.string().url(),
  secondaryImage: z.string().url().optional().nullable(),
  type: z.string().min(1).max(255),
  content: z.string().min(1).max(255),
  createdAt: z.number(),
});

const DeleteNotificationsData = z.object({
  deletedCount: z.number(),
  deletedIds: z.array(z.string().uuid()).min(1),
});

export const NotificationResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(NotificationData).optional(),
});

export const DeleteNotificationsResponseDto = z.object({
  status: z.number(),
  message: z.string(),
  data: DeleteNotificationsData.optional(),
});
