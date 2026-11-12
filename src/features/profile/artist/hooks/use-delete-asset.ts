import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { useTokenStore } from "@/src/features/auth/state/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { deleteAsset } from "../api/delete-asset/route";
import { IDeleteAsset } from "../types/asset.types";
import { logger } from "@/src/utils/logger";

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

      logger.log({
        context: "Asset deleted successfully",
        data: result.value,
      });
      return result.value;
    },
    onSuccess: (data) => {
      if (data instanceof Error) {
        return;
      }

      void queryClient.invalidateQueries({
        queryKey: [`user-${userId}-posts`],
      });
      void queryClient.invalidateQueries({
        queryKey: [`fetch-user-notifications-${userId}`],
      });
    },
  });
};
