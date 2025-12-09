import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { addPostComment } from "../api/add-post-comment/route";
import { ExploreError } from "../errors/explore.error";
import {
  selectUserId,
  selectUser,
} from "../../auth/state/selectors/token.selectors";
import { useCommentActions } from "../state/explore-comment.store";
import type { Comment, CommentMeta } from "../state/explore-comment.store";
import type { AddCommentPayload } from "../types/explore-comment.types";

export const useAddPostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const user = useTokenStore(selectUser);
  const { addOptimisticComment, updateComment, removeComment } =
    useCommentActions();

  return useMutation({
    mutationKey: [`add-post-comment-${userId}`],

    mutationFn: async (payload: AddCommentPayload) => {
      const result = await ResultAsync.fromPromise(
        addPostComment(payload.postId, payload.comment),
        (error) => new ExploreError(`Error adding comment: ${error}`),
      ).andThen((data) => {
        if (data.status === 200 || data.status === 201) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Error adding comment. Status: ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },

    onMutate: async (variables) => {
      const { postId, comment, fileId } = variables;

      const tempId = `temp-${Date.now()}-${Math.random().toString(36).substring(7)}`;

      const extractNames = (fullName: string) => {
        const names = fullName.trim().split(" ");
        return {
          firstName: names[0] || "You",
          lastName: names.slice(1).join(" ") || "",
        };
      };

      const { firstName, lastName } = user?.firstName
        ? extractNames(user.firstName)
        : { firstName: "You", lastName: "" };

      const optimisticComment: Comment = {
        id: tempId,
        userId: userId || "",
        fileId,
        firstName,
        lastName,
        ProfilePicture: user?.imageUrl || null,
        comment,
        createdAt: Date.now(),
        isOptimistic: true,
      };

      addOptimisticComment(postId, optimisticComment);

      await queryClient.cancelQueries({
        queryKey: [`fetch-post-comments`, postId],
      });

      return { tempId, postId };
    },

    onSuccess: (data, variables, context) => {
      if (!context) return;

      if (data.data && Array.isArray(data.data)) {
        const realComment = data.data.find(
          (item: Comment | CommentMeta) =>
            "comment" in item && !item.id.startsWith("temp-"),
        ) as Comment | undefined;

        if (realComment) {
          updateComment(context.postId, context.tempId, {
            id: realComment.id,
            userId: realComment.userId,
            firstName: realComment.firstName,
            lastName: realComment.lastName,
            ProfilePicture: realComment.ProfilePicture,
            comment: realComment.comment,
            createdAt: realComment.createdAt,
            isOptimistic: false,
          });
        }
      } else if (data.data && "comment" in data.data) {
        const realComment = data.data as Comment;
        updateComment(context.postId, context.tempId, {
          id: realComment.id,
          userId: realComment.userId,
          firstName: realComment.firstName,
          lastName: realComment.lastName,
          ProfilePicture: realComment.ProfilePicture,
          comment: realComment.comment,
          createdAt: realComment.createdAt,
          isOptimistic: false,
        });
      }
    },

    onError: (error, variables, context) => {
      if (context) {
        removeComment(context.postId, context.tempId);
      }
      console.error("Failed to add comment:", error);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-post-comments`, variables.postId],
      });
    },
  });
};
