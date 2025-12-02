import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { fetchPostComments } from "@/src/features/explore/api/fetch-post-comments/route";
import { addPostComment } from "@/src/features/explore/api/add-post-comments/route";
import { hidePostComment } from "@/src/features/explore/api/hide-post-comments/route";
import { deletePostComment } from "@/src/features/explore/api/delete-post-comments/route";
import { TComment, TFetchCommentsResponse } from "../types/explore.types";
import { CommentError } from "../errors/explore.error";

interface UseCommentsProps {
  fileId: string;
  userId: string;
  page?: number;
  limit?: number;
  userName?: string;
  userAvatar?: string;
}

export const useComments = ({
  fileId,
  userId,
  page = 1,
  limit = 10,
  userName = "You",
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
}: UseCommentsProps) => {
  const queryClient = useQueryClient();

  // ============================================
  // FETCH COMMENTS QUERY
  // ============================================
  const fetchCommentsQuery = useQuery<TFetchCommentsResponse>({
    queryKey: ["postComments", fileId, page],
    queryFn: async () => {
      const response = await fetchPostComments({ fileId, page, limit });
      return response.data;
    },
    retry: (failureCount, error) => {
      // Don't retry on CommentError
      if (error instanceof CommentError) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 30000, // 30 seconds
  });

  // ============================================
  // ADD COMMENT MUTATION
  // ============================================
  const addCommentMutation = useMutation({
    mutationFn: async (commentText: string) => {
      const response = await addPostComment({
        userId,
        fileId,
        comment: commentText,
      });
      return response.data;
    },
    onMutate: async (newCommentText) => {
      await queryClient.cancelQueries({
        queryKey: ["postComments", fileId],
      });

      // Get previous data
      const previousData = queryClient.getQueryData<TFetchCommentsResponse>([
        "postComments",
        fileId,
        page,
      ]);

      // Create optimistic comment
      const optimisticComment: TComment = {
        id: `temp-${Date.now()}`,
        userId,
        firstName: userName.split(" ")[0] || "You",
        lastName: userName.split(" ")[1] || "",
        profilePicture: userAvatar,
        comment: newCommentText,
        createdAt: new Date().toISOString(),
      };

      // Optimistically update cache
      if (previousData) {
        queryClient.setQueryData<TFetchCommentsResponse>(
          ["postComments", fileId, page],
          {
            ...previousData,
            data: [optimisticComment, ...previousData.data],
            meta: {
              ...previousData.meta,
              totalItems: previousData.meta.totalItems + 1,
            },
          },
        );
      }

      return { previousData };
    },
    onError: (error: Error, _newComment, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(
          ["postComments", fileId, page],
          context.previousData,
        );
      }

      const errorMessage =
        error instanceof CommentError ? error.message : "Failed to add comment";

      toast.error(errorMessage);
      console.error("Add comment error:", error);
    },
    onSuccess: () => {
      toast.success("Comment added successfully!");
    },
    onSettled: () => {
      // Refetch to get actual server data
      queryClient.invalidateQueries({
        queryKey: ["postComments", fileId],
      });
    },
  });

  // ============================================
  // HIDE COMMENT MUTATION
  // ============================================
  const hideCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await hidePostComment({
        userId,
        commentId,
      });
      return response.data;
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["postComments", fileId],
      });

      const previousData = queryClient.getQueryData<TFetchCommentsResponse>([
        "postComments",
        fileId,
        page,
      ]);

      // Optimistically remove comment
      if (previousData) {
        queryClient.setQueryData<TFetchCommentsResponse>(
          ["postComments", fileId, page],
          {
            ...previousData,
            data: previousData.data.filter(
              (comment) => comment.id !== commentId,
            ),
            meta: {
              ...previousData.meta,
              totalItems: previousData.meta.totalItems - 1,
            },
          },
        );
      }

      return { previousData };
    },
    onError: (error: Error, _commentId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["postComments", fileId, page],
          context.previousData,
        );
      }

      const errorMessage =
        error instanceof CommentError
          ? error.message
          : "Failed to hide comment";

      toast.error(errorMessage);
      console.error("Hide comment error:", error);
    },
    onSuccess: () => {
      toast.success("Comment hidden");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["postComments", fileId],
      });
    },
  });

  // ============================================
  // DELETE COMMENT MUTATION
  // ============================================
  const deleteCommentMutation = useMutation({
    mutationFn: async (commentId: string) => {
      const response = await deletePostComment({
        userId,
        commentId,
      });
      return response.data;
    },
    onMutate: async (commentId) => {
      await queryClient.cancelQueries({
        queryKey: ["postComments", fileId],
      });

      const previousData = queryClient.getQueryData<TFetchCommentsResponse>([
        "postComments",
        fileId,
        page,
      ]);

      // Optimistically remove comment
      if (previousData) {
        queryClient.setQueryData<TFetchCommentsResponse>(
          ["postComments", fileId, page],
          {
            ...previousData,
            data: previousData.data.filter(
              (comment) => comment.id !== commentId,
            ),
            meta: {
              ...previousData.meta,
              totalItems: previousData.meta.totalItems - 1,
            },
          },
        );
      }

      return { previousData };
    },
    onError: (error: Error, _commentId, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["postComments", fileId, page],
          context.previousData,
        );
      }

      const errorMessage =
        error instanceof CommentError
          ? error.message
          : "Failed to delete comment";

      toast.error(errorMessage);
      console.error("Delete comment error:", error);
    },
    onSuccess: () => {
      toast.success("Comment deleted successfully");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: ["postComments", fileId],
      });
    },
  });

  return {
    // Query data
    comments: fetchCommentsQuery.data?.data || [],
    meta: fetchCommentsQuery.data?.meta,
    isLoading: fetchCommentsQuery.isLoading,
    isError: fetchCommentsQuery.isError,
    error: fetchCommentsQuery.error,

    // Mutations
    addComment: addCommentMutation.mutate,
    isAddingComment: addCommentMutation.isPending,

    hideComment: hideCommentMutation.mutate,
    isHidingComment: hideCommentMutation.isPending,

    deleteComment: deleteCommentMutation.mutate,
    isDeletingComment: deleteCommentMutation.isPending,

    // Refetch function
    refetch: fetchCommentsQuery.refetch,
  };
};
