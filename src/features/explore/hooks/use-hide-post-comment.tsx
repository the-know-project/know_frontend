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
import type { IHideComment } from "../types/explore-comment.types";

type HideCommentParams = Omit<IHideComment, "userId">;

export const useHidePostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { removeComment, addOptimisticComment } = useCommentActions();

  return useMutation({
    mutationKey: [`hide-post-comment-${userId}`],

    mutationFn: async (payload: HideCommentParams) => {
      if (!userId) throw new ExploreError("User not authenticated");

      const result = await ResultAsync.fromPromise(
        hidePostComment({
          userId,
          commentId: payload.commentId,
        }),
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
      const { fileId, commentId } = variables;

      await queryClient.cancelQueries({
        queryKey: [`fetch-post-comments`, fileId, 1],
      });

      const { comments } = useCommentStore.getState();
      const postComments = comments[fileId as string] || [];
      const hiddenComment = postComments.find((c) => c.id === commentId);

      removeComment(fileId as string, commentId);

      return { hiddenComment, fileId };
    },

    onError: (error, variables, context) => {
      if (context?.hiddenComment) {
        addOptimisticComment(context.fileId as string, context.hiddenComment);
      }
      console.error("Failed to hide comment:", error);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-post-comments`, variables.fileId],
      });
    },
  });
};
