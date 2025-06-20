import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchUserNotifications } from "../api/fetch-notifications/route";
import { NotificationError } from "../error/notification.error";
import { NOTIFICATION_ERROR_MESSAGES } from "../data/notifications.data";
import { NotificationResponseDto } from "../dto/notifications.dto";

export const useFetchUserNotifications = () => {
  const userId = useTokenStore((state) => state.user?.id);

  return useQuery({
    queryKey: [`fetch-user-notifications-${userId}`],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchUserNotifications(userId as string),
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

      const validatedData = NotificationResponseDto.parse(result.value);
      if (validatedData.status === 200) {
        return validatedData.data;
      } else {
        throw new NotificationError(
          NOTIFICATION_ERROR_MESSAGES.ERROR_FETCHING_NOTIFICATIONS,
        );
      }
    },
    staleTime: 10000,
  });
};
