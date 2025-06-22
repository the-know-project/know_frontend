import { ApiClient } from "@/src/lib/api-client";
import { IDeleteNotifications } from "../../types/notification.types";
import { NOTIFICATIONS_OP } from "../../data/notifications.route";

export async function deleteNotifications(ctx: IDeleteNotifications) {
  return await ApiClient.post(NOTIFICATIONS_OP.DELETE_USER_NOTIFICATIONS, ctx);
}
