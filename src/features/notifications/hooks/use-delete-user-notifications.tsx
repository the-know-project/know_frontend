import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { deleteNotifications } from "../api/delete-notifications/route";
import { NotificationError } from "../error/notification.error";
import {
  IDeleteNotifications,
  INotificationResponseDto,
} from "../types/notification.types";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { useNotificationActions } from "../state/store/notifications.store";
import { INotification } from "../state/interface/notifications.interface";

export const useDeleteUserNotifications = () => {
  const queryClient = useQueryClient();
  const user = useTokenStore(selectUser);
  const { deleteNotification, addNotifications } = useNotificationActions();

  return useMutation({
    mutationKey: [`delete-user-notifications-${user?.id}`],
    mutationFn: async (ctx: Omit<IDeleteNotifications, "userId">) => {
      if (!user) {
        throw new NotificationError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        deleteNotifications({
          userId: user.id as string,
          notificationIds: ctx.notificationIds,
        }),
        (error: any) =>
          new NotificationError(`Error deleting notifications: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new NotificationError(`Error deleting notifications ${data.message}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onMutate: async (variables) => {
      if (!user) return;

      const queryKey = [`fetch-user-notifications-${user.id}`];
      await queryClient.cancelQueries({ queryKey });

      const previousNotifications =
        queryClient.getQueryData<INotificationResponseDto>(queryKey);

      const notificationsToDelete =
        previousNotifications?.data?.filter((n) =>
          variables.notificationIds.includes(String(n.id)),
        ) ?? [];

      deleteNotification(user.id, variables.notificationIds);

      queryClient.setQueryData<INotificationResponseDto>(queryKey, (old) => {
        if (!old || !old.data) return old;
        return {
          ...old,
          data: old.data.filter(
            (n) => !variables.notificationIds.includes(String(n.id)),
          ),
        };
      });

      return { previousNotifications, notificationsToDelete };
    },
    onError: (err, variables, context) => {
      if (!user) return;

      if (context?.notificationsToDelete) {
        addNotifications(user.id, context.notificationsToDelete as INotification[]);
      }

      if (context?.previousNotifications) {
        queryClient.setQueryData(
          [`fetch-user-notifications-${user.id}`],
          context.previousNotifications,
        );
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-user-notifications-${user?.id}`],
      });
    },
  });
};
