import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { useTokenStore } from "@/src/features/auth/state/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { IListAsset } from "../types/asset.types";
import { listAsset } from "../api/list-asset/route";

export const useListAsset = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`list-asset-${userId}`],
    mutationFn: async (ctx: IListAsset) => {
      const result = await ResultAsync.fromPromise(
        listAsset(ctx),
        (error) => new Error(`Error listing asset ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new Error(`Error listing asset ${data.status}`));
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-${userId}-posts`],
      });
    },
  });
};
