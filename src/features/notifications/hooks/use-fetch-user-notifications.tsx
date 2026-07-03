import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserNotifications } from "../api/fetch-notifications/route";
import { NOTIFICATION_ERROR_MESSAGES } from "../data/notifications.data";
import { NotificationError } from "../error/notification.error";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { useNotificationActions } from "../state/notification.store";

export const useFetchUserNotifications = (options?: { enabled?: boolean }) => {
  const user = useTokenStore(selectUser);
  const { setNotifications, setLoading } = useNotificationActions();

  return useQuery({
    queryKey: [`fetch-user-notifications-${user?.id}`],
    enabled:
      options?.enabled !== undefined ? options.enabled && !!user : !!user,
    queryFn: async () => {
      if (!user) {
        throw new Error("User not available");
      }

      setLoading(user.id, true);

      const result = await ResultAsync.fromPromise(
        fetchUserNotifications(user.id as string),
        (error) =>
          new NotificationError(`Error fetching notifications: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new NotificationError(
              NOTIFICATION_ERROR_MESSAGES.ERROR_FETCHING_NOTIFICATIONS,
            ),
          );
        }
      });

      if (result.isErr()) {
        setLoading(user.id, false);
        throw result.error;
      }

      setNotifications(user.id, result.value.data || []);
      setLoading(user.id, false);

      return result.value;
    },
    staleTime: 10000,
  });
};
