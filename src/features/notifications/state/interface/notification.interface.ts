import { INotificationData } from "../../types/notification.types";

export interface INotificationState {
  notifications: Record<string, INotificationData[]>;
  isLoading: Record<string, boolean>;

  setNotifications: (userId: string, data: INotificationData[]) => void;
  removeNotification: (userId: string, notificationId: string) => void;
  removeNotifications: (userId: string, notificationIds: string[]) => void;
  setLoading: (userId: string, isLoading: boolean) => void;
  clearUserNotifications: (userId: string) => void;
}
