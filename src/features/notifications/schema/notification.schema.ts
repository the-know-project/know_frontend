import { z } from "zod";

export const DeleteNotifications = z.object({
  userId: z.string().uuid(),
  notificationIds: z.array(z.string().uuid()).min(1),
});
