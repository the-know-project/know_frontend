import { z } from "zod";
import { NotificationData } from "../dto/notifications.dto";

export type INotificationData = z.infer<typeof NotificationData>;
