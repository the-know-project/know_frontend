import { z } from "zod";
import { NotificationData } from "../dto/notifications.dto";
import { DeleteNotifications } from "../schema/notification.schema";

export type INotificationData = z.infer<typeof NotificationData>;
export type IDeleteNotifications = z.infer<typeof DeleteNotifications>;
