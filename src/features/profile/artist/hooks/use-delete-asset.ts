import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { useTokenStore } from "@/src/features/auth/state/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { deleteAsset } from "../api/delete-asset/route";
import { IDeleteAsset } from "../types/asset.types";

export const useDeleteAsset = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`delete-asset-${userId}`],
    mutationFn: async (ctx: IDeleteAsset) => {
      const result = await ResultAsync.fromPromise(
        deleteAsset(ctx),
        (error) => new Error(`Error deleting asset ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        }
        return err(new Error(`Error deleting asset ${data.status}`));
      });

      if (result.isErr()) {
        return result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          `user-${userId}-posts`,
          `fetch-user-notifications-${userId}`,
        ],
      });
    },
  });
};
