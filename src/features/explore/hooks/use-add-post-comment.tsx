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

import { IPostComment } from "../types/explore-comment.types";
import {
  Comment,
  CommentMeta,
} from "../state/interface/explore-comment.interface";
import { getFingerPrint } from "@/src/utils/fingerprint";

type PostCommentParams = Omit<IPostComment, "userId">;
export const useAddPostComment = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const user = useTokenStore(selectUser);
  const { addOptimisticComment, updateComment, removeComment } =
    useCommentActions();

  return useMutation({
    mutationKey: [`add-post-comment-${userId}`],

    mutationFn: async (payload: PostCommentParams) => {
      if (!userId) {
        throw new ExploreError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        addPostComment({
          userId: userId,
          comment: payload.comment,
          fileId: payload.fileId,
        }),
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
      const { comment, fileId } = variables;

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

      const fingerPrint = getFingerPrint();

      const optimisticComment: Comment = {
        id: fingerPrint,
        userId: userId || "",
        firstName,
        lastName,
        profilePicture: user?.imageUrl || null,
        comment,
        createdAt: Date.now(),
        isOptimistic: true,
      };

      addOptimisticComment(fileId, optimisticComment);

      await queryClient.cancelQueries({
        queryKey: [`fetch-post-comments`, fileId],
      });

      return { fileId, fingerPrint };
    },

    onSuccess: (data, variables, context) => {
      if (!context) return;

      if (data.data && Array.isArray(data.data)) {
        const realComment = data.data.find(
          (item: Comment | CommentMeta) =>
            "comment" in item && !item.id.startsWith("temp-"),
        ) as Comment | undefined;

        if (realComment) {
          updateComment(context.fileId, {
            id: realComment.id,
            userId: realComment.userId,
            firstName: realComment.firstName,
            lastName: realComment.lastName,
            profilePicture: realComment.profilePicture,
            comment: realComment.comment,
            createdAt: realComment.createdAt,
            isOptimistic: false,
          });
        }
      } else if (data.data && "comment" in data.data) {
        const realComment = data.data as Comment;
        updateComment(context.fileId, {
          id: realComment.id,
          userId: realComment.userId,
          firstName: realComment.firstName,
          lastName: realComment.lastName,
          profilePicture: realComment.profilePicture,
          comment: realComment.comment,
          createdAt: realComment.createdAt,
          isOptimistic: false,
        });
      }
    },

    onError: (error, variables, context) => {
      if (context) {
        removeComment(context.fileId, context.fingerPrint);
      }
      console.error("Failed to add comment:", error);
    },

    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-post-comments`, variables.fileId],
      });
    },
  });
};
