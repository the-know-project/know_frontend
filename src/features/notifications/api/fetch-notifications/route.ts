import { ApiClient } from "@/src/lib/api-client";
import { NOTIFICATIONS_OP } from "../../data/notifications.route";

export async function fetchUserNotifications(userId: string) {
  const path = `${NOTIFICATIONS_OP.FETCH_USER_NOTIFICATIONS}?userId=${userId}`;
  return await ApiClient.get(path);
}
