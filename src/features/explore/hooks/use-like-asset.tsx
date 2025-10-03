import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { likeAsset } from "../api/like-asset/route";
import { TLikeAsset } from "../types/explore.types";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useLikeAsset = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`like-asset-${userId}`],
    mutationFn: async (ctx: Pick<TLikeAsset, "fileId">) => {
      const result = await ResultAsync.fromPromise(
        likeAsset({
          userId: userId as string,
          fileId: ctx.fileId,
        }),
        (error) => new ExploreError(`Error liking asset ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new ExploreError(`Error liking asset ${data.status}`));
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-user-notifications-${userId}`],
      });
    },
  });
};
