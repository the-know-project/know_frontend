import { useMutation } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { unLikeAsset } from "../api/unlike-asset/route";
import { ExploreError } from "../errors/explore.error";
import { TLikeAsset } from "../types/explore.types";

export const useUnlikeAsset = () => {
  const userId = useTokenStore((state) => state.user?.id);
  if (!userId) {
    return new ExploreError("User not authenticated");
  }
  return useMutation({
    mutationKey: [`unlike-asset-${userId}`],
    mutationFn: async (ctx: Pick<TLikeAsset, "fileId">) => {
      const result = await ResultAsync.fromPromise(
        unLikeAsset({
          userId,
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

      console.log(result);
      return result.value;
    },
  });
};
