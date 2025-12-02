"use client";

import { useState } from "react";
import { Textarea } from "@/src/shared/ui/textarea";
import { useComments } from "../hooks/use-comments";

interface ExploreCommentSectionProps {
  fileId: string;
  userId: string;
  userAvatar?: string;
  userName?: string;
}

const ExploreCommentSection = ({
  fileId,
  userId,
  userAvatar = "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
  userName = "You",
}: ExploreCommentSectionProps) => {
  const [commentText, setCommentText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const {
    comments,
    meta,
    isLoading,
    isError,
    error,
    addComment,
    isAddingComment,
    hideComment,
    isHidingComment,
    deleteComment,
    isDeletingComment,
  } = useComments({
    fileId,
    userId,
    page: currentPage,
    limit: 10,
    userName,
    userAvatar,
  });

  // Helper function to format time ago
  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    const intervals = {
      year: 31536000,
      month: 2592000,
      week: 604800,
      day: 86400,
      hour: 3600,
      minute: 60,
    };

    for (const [unit, secondsInUnit] of Object.entries(intervals)) {
      const interval = Math.floor(seconds / secondsInUnit);
      if (interval >= 1) {
        return `${interval} ${unit}${interval > 1 ? "s" : ""} ago`;
      }
    }
    return "just now";
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) {
      return;
    }
    addComment(commentText);
    setCommentText("");
  };

  const handleHideComment = (commentId: string, commentOwner: string) => {
    if (
      confirm(
        `Are you sure you want to hide this comment from ${commentOwner}?`,
      )
    ) {
      hideComment(commentId);
    }
  };

  const handleDeleteComment = (commentId: string) => {
    if (confirm("Are you sure you want to delete your comment?")) {
      deleteComment(commentId);
    }
  };

  const handleLoadMore = () => {
    if (meta?.hasNextPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  return (
    <div className="mx-auto rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      {/* Comment input section */}
      <form onSubmit={handleAddComment} className="mb-8 flex items-start gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
          <img
            src={userAvatar}
            alt="Your avatar"
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face";
            }}
          />
        </div>
        <div className="flex-1">
          <Textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts on this project?"
            className="min-h-[80px] w-full resize-none bg-transparent text-sm text-gray-700 placeholder-gray-500 outline-none"
            disabled={isAddingComment}
            maxLength={1000}
          />
          <div className="mt-2 flex items-center justify-between">
            <span className="text-xs text-gray-500">
              {commentText.length}/1000
            </span>
            <button
              type="submit"
              disabled={isAddingComment || !commentText.trim()}
              className="rounded bg-blue-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isAddingComment ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Posting...
                </span>
              ) : (
                "Post Comment"
              )}
            </button>
          </div>
        </div>
      </form>

      {/* Loading state */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
          <p className="mt-3 text-sm text-gray-500">Loading comments...</p>
        </div>
      )}

      {/* Error state */}
      {isError && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4">
          <div className="flex items-start gap-3">
            <svg
              className="h-5 w-5 flex-shrink-0 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div className="flex-1">
              <p className="text-sm font-medium text-red-800">
                Failed to load comments
              </p>
              <p className="mt-1 text-sm text-red-700">
                {error?.message || "Please try again later."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!isLoading && !isError && comments.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
            />
          </svg>
          <p className="mt-4 text-sm font-medium text-gray-900">
            No comments yet
          </p>
          <p className="mt-1 text-sm text-gray-500">
            Be the first to share your thoughts!
          </p>
        </div>
      )}

      {/* Comments list */}
      {!isLoading && !isError && comments.length > 0 && (
        <>
          <div className="space-y-6">
            {comments.map((comment) => (
              <div
                key={comment.id}
                className="group flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-gray-50"
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-full">
                  <img
                    src={comment.profilePicture}
                    alt={`${comment.firstName}'s avatar`}
                    className="h-full w-full rounded-full object-cover"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face";
                    }}
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {comment.firstName} {comment.lastName}
                      </span>
                      {comment.userId === userId && (
                        <span className="rounded bg-blue-100 px-2 py-0.5 text-xs font-medium text-blue-800">
                          You
                        </span>
                      )}
                      <span className="text-xs text-gray-500">
                        {getTimeAgo(comment.createdAt)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                      {/* Delete button for comment owner */}
                      {comment.userId === userId && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="rounded p-1 text-xs text-red-600 transition-colors hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
                          disabled={isDeletingComment}
                          title="Delete comment"
                        >
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
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      )}

                      {/* Hide button for other users */}
                      {comment.userId !== userId && (
                        <button
                          onClick={() =>
                            handleHideComment(
                              comment.id,
                              `${comment.firstName} ${comment.lastName}`,
                            )
                          }
                          className="rounded p-1 text-xs text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50"
                          disabled={isHidingComment}
                          title="Hide comment"
                        >
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
                              d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="text-sm break-words text-gray-700">
                    {comment.comment}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {meta && (
            <div className="mt-6 space-y-3 border-t border-gray-100 pt-6">
              <div className="flex items-center justify-between text-xs text-gray-500">
                <span>
                  Showing {comments.length} of {meta.totalItems} comment
                  {meta.totalItems !== 1 ? "s" : ""}
                </span>
                {meta.totalPages > 1 && (
                  <span>
                    Page {meta.currentPage} of {meta.totalPages}
                  </span>
                )}
              </div>
              {meta.hasNextPage && (
                <button
                  onClick={handleLoadMore}
                  className="flex w-full items-center justify-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Load more comments
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
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ExploreCommentSection;
