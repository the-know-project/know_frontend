import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { deleteNotifications } from "../api/delete-notifications/route";
import { NotificationError } from "../error/notification.error";
import { IDeleteNotifications } from "../types/notification.types";
import { DeleteNotificationsResponseDto } from "../dto/notifications.dto";

export const useDeleteUserNotifications = () => {
  const queryClient = useQueryClient();
  const user = useTokenStore((state) => state.user);

  return useMutation({
    mutationKey: [`delete-user-notifications-${user?.id}`],
    mutationFn: async (ctx: Omit<IDeleteNotifications, "userId">) => {
      const result = await ResultAsync.fromPromise(
        deleteNotifications({
          userId: user?.id,
          notificationIds: ctx.notificationIds,
        }),
        (error: any) =>
          new NotificationError(`Error deleting notifications: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new NotificationError(
              `Error deleteing notifciations ${data.message}`,
            ),
          );
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      console.log(result.value);
      const validatedData = DeleteNotificationsResponseDto.parse(result.value);
      return validatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-user-notifications-${user?.id}`],
      });
    },
  });
};
