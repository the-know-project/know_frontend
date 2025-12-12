import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { deletePostComment } from "../api/delete-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import {
  useCommentActions,
  useCommentStore,
} from "../state/explore-comment.store";
import { IDeleteComment } from "../types/explore-comment.types";

type DeleteCommentParams = Omit<IDeleteComment, "userId">;
export const useDeletePostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { removeComment, addOptimisticComment } = useCommentActions();

  return useMutation({
    mutationKey: [`delete-post-comment-${userId}`],

    mutationFn: async (payload: DeleteCommentParams) => {
      if (!userId) {
        throw new ExploreError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        deletePostComment({
          userId,
          commentId: payload.commentId,
        }),
        (error) => new ExploreError(`Error deleting comment: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Error deleting comment. Status: ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },

    onMutate: async (variables) => {
      const { commentId, fileId } = variables;

      await queryClient.cancelQueries({
        queryKey: [`fetch-post-comments`, fileId, 1],
      });

      const { comments } = useCommentStore.getState();
      const postComments = comments[fileId as string] || [];
      const deletedComment = postComments.find((c) => c.id === commentId);

      removeComment(fileId as string, commentId);

      return { deletedComment, fileId };
    },

    onError: (error, variables, context) => {
      if (context?.deletedComment) {
        addOptimisticComment(context.fileId as string, context.deletedComment);
      }
      console.error("Failed to delete comment:", error);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-post-comments`, variables.fileId, 1],
      });
    },
  });
};
