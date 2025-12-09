import { useState, useEffect, useCallback } from "react";
import { useTokenStore } from "@/src/features/auth/state/store/token.store";
import {
  usePostComments as usePostCommentsSelector,
  useCommentActions,
} from "../state/explore-comment.store";
import { useFetchPostComments } from "./use-fetch-post-comment";
import { useAddPostComment } from "./use-add-post-comment";
import { useDeletePostComment } from "./use-delete-post-comment";
import { useHidePostComment } from "./use-hide-post-comment";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";

export const usePostComments = (postId: string) => {
  const user = useTokenStore((state) => state.user);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);

  const comments = usePostCommentsSelector(postId);
  const { setComments, appendComments, setLoading } = useCommentActions();

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const fetchQuery = useFetchPostComments(postId, page);
  const addMutation = useAddPostComment();
  const deleteMutation = useDeletePostComment();
  const hideMutation = useHidePostComment();

  useEffect(() => {
    if (fetchQuery.data?.data) {
      const rawData = fetchQuery.data.data;
      const metaItem = rawData.find(
        (item: any) => item.totalPage !== undefined,
      );

      if (metaItem) setTotalPages(metaItem.totalPage);

      if (page === 1) {
        setComments(postId, rawData);
      } else {
        appendComments(postId, rawData);
      }
    }
  }, [fetchQuery.data, page, postId, setComments, appendComments]);

  useEffect(() => {
    setLoading(postId, fetchQuery.isLoading);
  }, [fetchQuery.isLoading, postId, setLoading]);

  const loadMore = useCallback(() => {
    if (!fetchQuery.isLoading && page < totalPages) {
      setPage((prev) => prev + 1);
    }
  }, [fetchQuery.isLoading, page, totalPages]);

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasNextPage: page < totalPages,
    isLoadingMore: fetchQuery.isLoading && page > 1,
    enabled: !fetchQuery.isLoading,
  });

  const handleAddComment = async (content: string) => {
    if (!isAuthenticated || !user) {
      throw new Error("User must be authenticated to comment");
    }

    try {
      await addMutation.mutateAsync({
        postId,
        comment: content.trim(),
      });
    } catch (error) {
      console.error("Failed to add comment:", error);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      await deleteMutation.mutateAsync({
        commentId,
        postId,
      });
    } catch (error) {
      console.error("Failed to delete comment:", error);
      throw error;
    }
  };

  const handleHideComment = async (commentId: string) => {
    try {
      await hideMutation.mutateAsync({
        commentId,
        postId,
      });
    } catch (error) {
      console.error("Failed to hide comment:", error);
      throw error;
    }
  };

  return {
    comments,
    currentUser: user,
    sentinelRef,
    isLoadingInitial: fetchQuery.isLoading && page === 1,
    isLoadingMore: fetchQuery.isLoading && page > 1,
    isAdding: addMutation.isPending,
    isDeleting: deleteMutation.isPending,
    isHiding: hideMutation.isPending,
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
    hideComment: handleHideComment,
    refetch: fetchQuery.refetch,
  };
};
