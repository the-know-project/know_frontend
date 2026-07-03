import { useTokenStore } from "../../auth/state/store";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { useFetchUserNotifications } from "./use-fetch-user-notifications";
import { useDeleteUserNotifications } from "./use-delete-user-notifications";
import {
  useUserNotifications,
  useIsNotificationsLoading,
} from "../state/notification.store";

export const useNotifications = () => {
  const user = useTokenStore(selectUser);

  const notifications = useUserNotifications(user?.id || null);
  const isStoreLoading = useIsNotificationsLoading(user?.id || null);

  const fetchQuery = useFetchUserNotifications();
  const deleteMutation = useDeleteUserNotifications();

  const deleteNotification = async (notificationId: string) => {
    await deleteMutation.mutateAsync({
      notificationIds: [notificationId],
    });
  };

  const deleteAllNotifications = async () => {
    if (notifications.length === 0) return;

    const allIds = notifications.map((notification) => notification.id);
    await deleteMutation.mutateAsync({
      notificationIds: allIds,
    });
  };

  return {
    notifications,
    isLoading: fetchQuery.isLoading || isStoreLoading,
    isDeleting: deleteMutation.isPending,
    deleteNotification,
    deleteAllNotifications,
    refetch: fetchQuery.refetch,
  };
};
