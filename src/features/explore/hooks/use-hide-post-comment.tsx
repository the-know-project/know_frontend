import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { hidePostComment } from "../api/hide-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useHidePostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`hide-post-comment-${userId}`],
    mutationFn: async (ctx: { commentId: string }) => {
      const result = await ResultAsync.fromPromise(
        hidePostComment(ctx.commentId),
        (error) => new ExploreError(`Error hiding comment ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new ExploreError(`Error hiding comment ${data.status}`));
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-post-comments`],
      });
    },
  });
};
