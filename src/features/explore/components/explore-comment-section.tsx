"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/src/shared/ui/textarea";
import { useAddPostComment } from "../hooks/use-add-post-comment";
import { useFetchPostComments } from "../hooks/use-fetch-post-comment";
import { useDeletePostComment } from "../hooks/use-delete-post-comment";
import { useHidePostComment } from "../hooks/use-hide-post-comment";
import {
  useCommentActions,
  usePostComments,
} from "../state/explore-comment.store";
import { formatDistanceToNow } from "date-fns";
import type { Comment } from "../state/explore-comment.store";

interface ExploreCommentSectionProps {
  postId: string;
  initialPage?: number;
}

const ExploreCommentSection = ({
  postId,
  initialPage = 1,
}: ExploreCommentSectionProps) => {
  const [commentText, setCommentText] = useState("");
  const [currentPage, setCurrentPage] = useState(initialPage);

  const { mutateAsync: addComment, isPending: isAddingComment } =
    useAddPostComment();
  const { mutateAsync: deleteComment, isPending: isDeletingComment } =
    useDeletePostComment();
  const { mutateAsync: hideComment, isPending: isHidingComment } =
    useHidePostComment();
  const { data: fetchedComments, isLoading: isFetchingComments } =
    useFetchPostComments(postId, currentPage);

  const comments = usePostComments(postId);
  const { setComments, appendComments, addOptimisticComment, removeComment } =
    useCommentActions();

  const [error, setError] = useState<string | null>(null);

  // Initialize comments from fetch
  useEffect(() => {
    if (fetchedComments?.data) {
      if (currentPage === 1) {
        setComments(postId, fetchedComments.data);
      } else {
        appendComments(postId, fetchedComments.data);
      }
    }
  }, [fetchedComments, postId, currentPage, setComments, appendComments]);

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setError(null);
    const optimisticId = `temp-${Date.now()}`;

    try {
      // Optimistic update
      const optimisticComment: Comment = {
        id: optimisticId,
        userId: "", // Will be filled by backend
        firstName: "You",
        lastName: "",
        ProfilePicture: null,
        comment: commentText,
        createdAt: Date.now(),
      };

      addOptimisticComment(postId, optimisticComment);

      const response = await addComment({ postId, comment: commentText });

      removeComment(postId, optimisticId);

      if (response && response.data) {
        addOptimisticComment(postId, response.data);
      }

      setCommentText("");
    } catch (apiError) {
      removeComment(postId, optimisticId);

      const errorMessage =
        apiError instanceof Error ? apiError.message : "Failed to add comment";

      setError(errorMessage);
      console.error("Error adding comment:", apiError);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    const commentToDelete = comments.find((c) => c.id === commentId);
    setError(null);

    try {
      // Optimistic update
      removeComment(postId, commentId);

      // API call
      await deleteComment({ commentId });
    } catch (apiError) {
      // Rollback
      if (commentToDelete) {
        addOptimisticComment(postId, commentToDelete);
      }

      const errorMessage =
        apiError instanceof Error
          ? apiError.message
          : "Failed to delete comment";

      setError(errorMessage);
      console.error("Error deleting comment:", apiError);
    }
  };

  const handleHideComment = async (commentId: string) => {
    const commentToHide = comments.find((c) => c.id === commentId);
    setError(null);

    try {
      // Optimistic update
      removeComment(postId, commentId);

      // API call
      await hideComment({ commentId });
    } catch (apiError) {
      // Rollback
      if (commentToHide) {
        addOptimisticComment(postId, commentToHide);
      }

      const errorMessage =
        apiError instanceof Error ? apiError.message : "Failed to hide comment";

      setError(errorMessage);
      console.error("Error hiding comment:", apiError);
    }
  };

  const handleLoadMore = () => {
    setCurrentPage((prev) => prev + 1);
  };

  const formatTimeAgo = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  return (
    <div className="mx-auto rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      <div className="mb-20 flex items-start gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
            alt="Your avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <form onSubmit={handleAddComment}>
            <Textarea
              placeholder="What are your thoughts on this project?"
              className="profile_content w-full bg-transparent"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isAddingComment}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isAddingComment || !commentText.trim()}
                className="font-bebas rounded bg-gray-300 px-4 py-1 text-sm font-medium tracking-wider text-gray-600 transition-colors hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAddingComment ? "Posting..." : "Share your work"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isFetchingComments && comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="profile_content">Loading comments...</p>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="profile_content">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          {comments.map((comment) => (
            <div key={comment.id} className="flex items-start gap-3">
              <div className="h-10 w-10 flex-shrink-0 rounded-full">
                <img
                  src={
                    comment.ProfilePicture ||
                    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
                  }
                  alt={`${comment.firstName}'s avatar`}
                  className="h-full w-full rounded-full object-cover"
                />
              </div>
              <div className="flex-1">
                <div className="mb-1 flex items-center gap-2">
                  <span className="profile_title !text-sm">
                    {comment.firstName} {comment.lastName}
                  </span>
                  <span className="profile_content !text-[12px]">
                    • {formatTimeAgo(comment.createdAt)}
                  </span>
                </div>
                <p className="profile_content !text-[14px]">
                  {comment.comment}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}

      {comments.length > 0 && (
        <div className="mt-6 text-center">
          <button
            onClick={handleLoadMore}
            disabled={isFetchingComments}
            className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isFetchingComments ? "Loading..." : "See all comments"}
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ExploreCommentSection;
