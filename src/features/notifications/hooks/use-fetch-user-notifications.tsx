import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useEffect } from "react";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserNotifications } from "../api/fetch-notifications/route";
import { NOTIFICATION_ERROR_MESSAGES } from "../data/notifications.data";
import { NotificationError } from "../error/notification.error";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { INotificationResponseDto } from "../types/notification.types";
import { useNotificationActions } from "../state/store/notifications.store";
import { INotification } from "../state/interface/notifications.interface";

export const useFetchUserNotifications = (options?: { enabled?: boolean }) => {
  const user = useTokenStore(selectUser);
  const { addNotifications } = useNotificationActions();

  const query = useQuery({
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

      return result.value as INotificationResponseDto;
    },

    staleTime: 10000,
  });

  useEffect(() => {
    if (query.isSuccess && query.data?.data && user) {
      addNotifications(user.id as string, query.data.data as INotification[]);
    }
  }, [query.isSuccess, query.data, user, addNotifications]);

  return query;
};
