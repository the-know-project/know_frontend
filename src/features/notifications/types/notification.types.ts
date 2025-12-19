import { z } from "zod";
import {
  NotificationData,
  NotificationResponseDto,
} from "../dto/notifications.dto";
import { DeleteNotifications } from "../schema/notification.schema";

export type INotificationData = z.infer<typeof NotificationData>;
export type IDeleteNotifications = z.infer<typeof DeleteNotifications>;
export type INotificationResponseDto = z.infer<typeof NotificationResponseDto>;
