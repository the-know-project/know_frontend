import { create } from "zustand";
import {
  INotification,
  INotificationState,
} from "../interface/notifications.interface";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export const useNotificationStore = create<INotificationState>()(
  subscribeWithSelector(
    persist(
      immer((set, get) => ({
        userNotification: {},
        _hasHydrated: false,
        setHasHydrated: (state) =>
          set(() => ({
            _hasHydrated: state,
          })),

        addNotifications: (userId, notifications) =>
          set((state) => {
            if (!state.userNotification[userId]) {
              state.userNotification[userId] = [];
            }
            const existingIds = new Set(
              state.userNotification[userId].map((n) => n.id),
            );
            const newNotifications = notifications.filter(
              (n) => !existingIds.has(n.id),
            );
            if (newNotifications.length > 0) {
              state.userNotification[userId].push(...newNotifications);
            }
          }),

        fetchNotifications: (userId) => {
          const notifications = get().userNotification[userId] || [];
          return notifications.slice().sort((a, b) => b.createdAt - a.createdAt);
        },

        deleteNotification: (userId, ids) =>
          set((state) => {
            if (state.userNotification[userId]) {
              const idsToDelete = new Set(ids.map(String));
              state.userNotification[userId] = state.userNotification[
                userId
              ].filter((notification) => !idsToDelete.has(String(notification.id)));
            }
          }),

        deleteAllNotifications: (userId) =>
          set((state) => {
            if (state.userNotification[userId]) {
              state.userNotification[userId] = [];
            }
          }),
      })),
      {
        name: "notifications-store",
        storage: {
          getItem: async (key) => {
            if (typeof window === "undefined") return null;
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
          },
          setItem: async (key, value) => {
            if (typeof window === "undefined") return null;
            localStorage.setItem(key, JSON.stringify(value));
          },
          removeItem: async (key) => {
            if (typeof window === "undefined") return null;
            localStorage.removeItem(key);
          },
        },
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
        version: 1,
      },
    ),
  ),
);

export const useFetchNotifications = (userId: string) => {
  const notifications = useNotificationStore((state) =>
    state.fetchNotifications(userId),
  );
  return notifications;
};

export const useNotificationActions = () => {
  const addNotifications = (userId: string, notifications: INotification[]) => {
    useNotificationStore.getState().addNotifications(userId, notifications);
  };

  const deleteNotification = (userId: string, ids: (string | number)[]) => {
    useNotificationStore.getState().deleteNotification(userId, ids);
  };

  const deleteAllNotifications = (userId: string) => {
    useNotificationStore.getState().deleteAllNotifications(userId);
  };

  return { addNotifications, deleteNotification, deleteAllNotifications };
};
