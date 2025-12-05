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
  const {
    setComments,
    appendComments,
    addOptimisticComment,
    removeComment,
    setLoading,
  } = useCommentActions();

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
  }, [fetchQuery.data, page, postId]);

  useEffect(() => {
    setLoading(postId, fetchQuery.isLoading);
  }, [fetchQuery.isLoading, postId]);

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
      return;
    }

    const tempId = `temp-${Date.now()}`;

    addOptimisticComment(postId, {
      id: tempId,
      userId: user.id,
      firstName: user.firstName,
      lastName: "",
      ProfilePicture: user.imageUrl,
      comment: content,
      createdAt: Date.now(),
    });

    try {
      await addMutation.mutateAsync({ postId, comment: content });
    } catch (error) {
      console.error("Failed to add comment");
      removeComment(postId, tempId);
      throw error;
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    removeComment(postId, commentId);
    try {
      await deleteMutation.mutateAsync({ commentId });
    } catch (error) {
      fetchQuery.refetch();
    }
  };

  const handleHideComment = async (commentId: string) => {
    removeComment(postId, commentId);
    try {
      await hideMutation.mutateAsync({ commentId });
    } catch (error) {
      fetchQuery.refetch();
    }
  };

  return {
    comments,
    currentUser: user,
    sentinelRef,
    isLoadingInitial: fetchQuery.isLoading && page === 1,
    isLoadingMore: fetchQuery.isLoading && page > 1,
    isAdding: addMutation.isPending,
    addComment: handleAddComment,
    deleteComment: handleDeleteComment,
    hideComment: handleHideComment,
  };
};
