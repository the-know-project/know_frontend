import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { INotificationState } from "./interface/notification.interface";

export const useNotificationStore = create<INotificationState>()(
  persist(
    immer((set) => ({
      notifications: {},
      isLoading: {},

      setNotifications: (userId, data) =>
        set((state) => {
          state.notifications[userId] = data;
        }),

      removeNotification: (userId, notificationId) =>
        set((state) => {
          if (state.notifications[userId]) {
            state.notifications[userId] = state.notifications[userId].filter(
              (notification) => notification.id !== notificationId,
            );
          }
        }),

      removeNotifications: (userId, notificationIds) =>
        set((state) => {
          if (state.notifications[userId]) {
            const idsToRemove = new Set(notificationIds);
            state.notifications[userId] = state.notifications[userId].filter(
              (notification) => !idsToRemove.has(notification.id),
            );
          }
        }),

      setLoading: (userId, isLoading) =>
        set((state) => {
          state.isLoading[userId] = isLoading;
        }),

      clearUserNotifications: (userId) =>
        set((state) => {
          delete state.notifications[userId];
          delete state.isLoading[userId];
        }),
    })),
    {
      name: "notification-storage",
      version: 1,
      partialize: (state) => ({
        notifications: state.notifications,
      }),
    },
  ),
);

export const useUserNotifications = (userId: string | null) =>
  useNotificationStore((state) =>
    userId ? state.notifications[userId] || [] : [],
  );

export const useIsNotificationsLoading = (userId: string | null) =>
  useNotificationStore((state) =>
    userId ? state.isLoading[userId] || false : false,
  );

export const useNotificationActions = () => {
  const setNotifications = useNotificationStore(
    (state) => state.setNotifications,
  );
  const removeNotification = useNotificationStore(
    (state) => state.removeNotification,
  );
  const removeNotifications = useNotificationStore(
    (state) => state.removeNotifications,
  );
  const setLoading = useNotificationStore((state) => state.setLoading);
  const clearUserNotifications = useNotificationStore(
    (state) => state.clearUserNotifications,
  );

  return {
    setNotifications,
    removeNotification,
    removeNotifications,
    setLoading,
    clearUserNotifications,
  };
};
