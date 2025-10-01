import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserNotifications } from "../api/fetch-notifications/route";
import { NOTIFICATION_ERROR_MESSAGES } from "../data/notifications.data";
import { NotificationError } from "../error/notification.error";

export const useFetchUserNotifications = (options?: { enabled?: boolean }) => {
  const user = useTokenStore((state) => state.user);

  return useQuery({
    queryKey: [`fetch-user-notifications-${user?.id}`],
    enabled:
      options?.enabled !== undefined ? options.enabled && !!user : !!user,
    queryFn: async () => {
      if (!user) {
        throw new Error("User not available");
      }

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
        throw result.error;
      }

      return result.value;
    },
    staleTime: 10000,
  });
};
