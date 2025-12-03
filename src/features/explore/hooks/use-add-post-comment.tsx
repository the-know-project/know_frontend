import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { addPostComment } from "../api/add-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useAddPostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`add-post-comment-${userId}`],
    mutationFn: async (ctx: { postId: string; comment: string }) => {
      const result = await ResultAsync.fromPromise(
        addPostComment(ctx.postId, ctx.comment),
        (error) => new ExploreError(`Error adding comment ${error}`),
      ).andThen((data) => {
        if (data.status === 200 || data.status === 201) {
          return ok(data);
        } else {
          return err(new ExploreError(`Error adding comment ${data.status}`));
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
