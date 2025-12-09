"use client";

import { useState } from "react";
import { Textarea } from "@/src/shared/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { usePostComments } from "../hooks/use-post-comments";

interface ExploreCommentSectionProps {
  postId: string;
}

const ExploreCommentSection = ({ postId }: ExploreCommentSectionProps) => {
  const {
    comments,
    currentUser,
    sentinelRef,
    isLoadingInitial,
    isLoadingMore,
    isAdding,
    addComment,
    deleteComment,
  } = usePostComments(postId);

  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    setError(null);

    try {
      await addComment(commentText);
      setCommentText("");
    } catch (err) {
      setError("Failed to post comment. Please try again.");
    }
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
            src={
              currentUser?.imageUrl ||
              "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
            }
            alt="Your avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <form onSubmit={onSubmit}>
            <Textarea
              placeholder="What are your thoughts on this project?"
              className="profile_content w-full bg-transparent"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isAdding}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isAdding || !commentText.trim()}
                className="font-bebas rounded bg-gray-300 px-4 py-1 text-sm font-medium tracking-wider text-gray-600 transition-colors hover:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding ? "Posting..." : "Share your work"}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isLoadingInitial ? (
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
          {comments.map((comment) => {
            const isOptimistic =
              comment.isOptimistic || comment.id.startsWith("temp-");

            return (
              <div
                key={comment.id}
                className={`flex items-start gap-3 transition-opacity duration-200 ${
                  isOptimistic ? "opacity-60" : "opacity-100"
                }`}
              >
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
            );
          })}
        </div>
      )}

      <div className="mt-6 text-center">
        {isLoadingMore && (
          <div className="flex items-center justify-center py-4">
            <span className="text-sm text-gray-500">Loading more...</span>
          </div>
        )}

        <div ref={sentinelRef} className="h-4 w-full bg-transparent" />
      </div>
    </div>
  );
};

export default ExploreCommentSection;
