import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { hidePostComment } from "../api/hide-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import {
  useCommentActions,
  useCommentStore,
} from "../state/explore-comment.store";
import type { HideCommentPayload } from "../types/explore-comment.types";

export const useHidePostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { removeComment, addOptimisticComment } = useCommentActions();

  return useMutation({
    mutationKey: [`hide-post-comment-${userId}`],

    mutationFn: async (payload: HideCommentPayload) => {
      const result = await ResultAsync.fromPromise(
        hidePostComment(payload.commentId),
        (error) => new ExploreError(`Error hiding comment: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Error hiding comment. Status: ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },

    onMutate: async (variables) => {
      const { commentId, postId } = variables;

      await queryClient.cancelQueries({
        queryKey: [`fetch-post-comments`, postId],
      });

      const { comments } = useCommentStore.getState();
      const postComments = comments[postId] || [];
      const hiddenComment = postComments.find((c) => c.id === commentId);

      removeComment(postId, commentId);

      return { hiddenComment, postId };
    },

    onError: (error, variables, context) => {
      if (context?.hiddenComment) {
        addOptimisticComment(context.postId, context.hiddenComment);
      }
      console.error("Failed to hide comment:", error);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-post-comments`, variables.postId],
      });
    },
  });
};
