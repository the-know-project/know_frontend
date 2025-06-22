import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchUserNotifications } from "../api/fetch-notifications/route";
import { NOTIFICATION_ERROR_MESSAGES } from "../data/notifications.data";
import { NotificationError } from "../error/notification.error";
import { useTokenStore } from "../../auth/state/store";
import { NotificationResponseDto } from "../dto/notifications.dto";

export const useFetchUserNotifications = () => {
  const user = useTokenStore((state) => state.user);

  return useQuery({
    queryKey: [`fetch-user-notifications-${user?.id}`],
    enabled: !!user,
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

      const validatedData = NotificationResponseDto.parse(result.value);
      return validatedData;
    },
    staleTime: 10000,
  });
};
