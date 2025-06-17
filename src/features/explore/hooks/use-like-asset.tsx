import { useMutation } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { likeAsset } from "../api/like-asset/route";
import { TLikeAsset } from "../types/explore.types";
import { ExploreError } from "../errors/explore.error";

export const useLikeAsset = () => {
  const userId = useTokenStore((state) => state.user?.id);

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

      console.log(result);
      return result.value;
    },
  });
};
