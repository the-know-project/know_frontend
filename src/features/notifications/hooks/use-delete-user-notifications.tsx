import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { deleteNotifications } from "../api/delete-notifications/route";
import { NotificationError } from "../error/notification.error";
import { IDeleteNotifications } from "../types/notification.types";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import {
  useNotificationActions,
  useNotificationStore,
} from "../state/notification.store";

type DeleteNotificationsParams = Omit<IDeleteNotifications, "userId">;

export const useDeleteUserNotifications = () => {
  const queryClient = useQueryClient();
  const user = useTokenStore(selectUser);
  const { removeNotifications, setNotifications } = useNotificationActions();

  return useMutation({
    mutationKey: [`delete-user-notifications-${user?.id}`],
    mutationFn: async (ctx: DeleteNotificationsParams) => {
      if (!user) {
        throw new NotificationError("User not authenticated");
      }

      const result = await ResultAsync.fromPromise(
        deleteNotifications({
          userId: user.id,
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
              `Error deleting notifications: ${data.message}`,
            ),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },

    // Update the local store first, then let the API call settle in the
    // background — mirrors the optimistic comment flow in
    // `use-add-post-comment.tsx` / `use-delete-post-comment.tsx`.
    onMutate: async (variables) => {
      if (!user) return;

      await queryClient.cancelQueries({
        queryKey: [`fetch-user-notifications-${user.id}`],
      });

      const previousNotifications =
        useNotificationStore.getState().notifications[user.id] || [];

      removeNotifications(user.id, variables.notificationIds);

      return { previousNotifications, userId: user.id };
    },

    onError: (error, variables, context) => {
      if (context) {
        setNotifications(context.userId, context.previousNotifications);
      }
      console.error("Failed to delete notifications:", error);
    },

    onSettled: () => {
      if (!user) return;
      queryClient.invalidateQueries({
        queryKey: [`fetch-user-notifications-${user.id}`],
      });
    },
  });
};
