import { NOTIFICATION_ERROR_MESSAGES } from "../data/notifications.data";

export class NotificationError extends Error {
  constructor(
    message: string = NOTIFICATION_ERROR_MESSAGES.ERROR_FETCHING_NOTIFICATIONS,
  ) {
    super(message);
    this.name = "NotificationError";
  }
}
