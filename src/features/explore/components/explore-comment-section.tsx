"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { MessageCircle, Send, Trash2 } from "lucide-react";
import { Textarea } from "@/src/shared/ui/textarea";
import { usePostComments } from "../hooks/use-post-comments";
import { Comment } from "../state/interface/explore-comment.interface";
import { BlankProfilePicture } from "@/src/constants/constants";

interface ExploreCommentSectionProps {
  fileId: string;
}

const MAX_COMMENT_LENGTH = 500;

const ExploreCommentSection = ({ fileId }: ExploreCommentSectionProps) => {
  const {
    comments,
    currentUser,
    canComment,
    sentinelRef,
    isLoadingInitial,
    isLoadingMore,
    isAdding,
    isDeleting,
    addComment,
    deleteComment,
  } = usePostComments({ fileId });

  const shouldReduceMotion = useReducedMotion();
  const [commentText, setCommentText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const comment = commentText.trim();
    if (!comment || !canComment) return;

    setError(null);
    try {
      await addComment(comment);
      setCommentText("");
    } catch {
      setError("Your comment could not be posted. Please try again.");
    }
  };

  const handleDelete = async (commentId: string) => {
    setError(null);
    try {
      await deleteComment(commentId);
    } catch {
      setError("This comment could not be deleted. Please try again.");
    }
  };

  const formatTimeAgo = (timestamp: number) => {
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return "recently";
    }
  };

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  };

  return (
    <section
      aria-label="Artwork comments"
      className="w-full rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5 lg:p-6"
    >
      <div className="mb-5 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-50 text-indigo-700">
            <MessageCircle className="h-4 w-4" />
          </span>
          <div>
            <h2 className="font-helvetica text-lg font-bold text-neutral-900">
              Comments
            </h2>
            <p className="font-grotesk text-xs text-neutral-500">
              Join the conversation about this artwork.
            </p>
          </div>
        </div>
        <span className="font-grotesk shrink-0 rounded-full bg-neutral-100 px-2.5 py-1 text-xs font-semibold text-neutral-600 tabular-nums">
          {comments.length}
        </span>
      </div>

      {canComment ? (
        <form onSubmit={onSubmit} className="mb-6">
          <div className="flex items-start gap-3">
            <img
              src={currentUser?.imageUrl || BlankProfilePicture}
              alt="Your avatar"
              className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 bg-neutral-100 object-cover"
            />
            <div className="min-w-0 flex-1">
              <Textarea
                aria-label="Write a comment"
                placeholder="Share a thoughtful comment…"
                maxLength={MAX_COMMENT_LENGTH}
                className="font-grotesk min-h-24 resize-y rounded-xl border-neutral-200 bg-neutral-50 text-sm leading-6 text-neutral-800 placeholder:text-neutral-400 focus-visible:border-indigo-400 focus-visible:ring-indigo-100"
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                disabled={isAdding}
              />
              <div className="mt-2 flex items-center justify-between gap-3">
                <span className="font-grotesk text-[11px] text-neutral-400 tabular-nums">
                  {commentText.length}/{MAX_COMMENT_LENGTH}
                </span>
                <button
                  type="submit"
                  disabled={isAdding || !commentText.trim()}
                  className="font-grotesk inline-flex min-h-10 items-center justify-center gap-2 rounded-xl bg-indigo-700 px-4 text-sm font-semibold text-white transition-colors hover:bg-indigo-800 focus-visible:ring-2 focus-visible:ring-indigo-400 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isAdding ? (
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  {isAdding ? "Posting" : "Post comment"}
                </button>
              </div>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-6 flex items-center justify-between gap-3 rounded-xl border border-neutral-200 bg-neutral-50 p-3 sm:p-4">
          <p className="font-grotesk text-sm text-neutral-600">
            Sign in to join the conversation.
          </p>
          <Link
            href="/login"
            className="font-grotesk inline-flex min-h-10 shrink-0 items-center rounded-lg bg-neutral-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-neutral-700"
          >
            Sign in
          </Link>
        </div>
      )}

      {error && (
        <p
          role="alert"
          className="font-grotesk mb-4 rounded-lg bg-red-50 px-3 py-2 text-xs text-red-700"
        >
          {error}
        </p>
      )}

      {isLoadingInitial ? (
        <div
          className="space-y-5 py-2"
          aria-label="Loading comments"
          aria-busy="true"
        >
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="flex animate-pulse items-start gap-3">
              <div className="h-10 w-10 shrink-0 rounded-full bg-neutral-200" />
              <div className="flex-1 space-y-2 pt-1">
                <div className="h-3 w-32 rounded bg-neutral-200" />
                <div className="h-3 w-full rounded bg-neutral-100" />
                <div className="h-3 w-2/3 rounded bg-neutral-100" />
              </div>
            </div>
          ))}
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center rounded-xl bg-neutral-50 px-4 py-8 text-center">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-neutral-500 shadow-sm ring-1 ring-neutral-200">
            <MessageCircle className="h-5 w-5" />
          </span>
          <p className="font-grotesk mt-3 text-sm font-semibold text-neutral-800">
            Start the conversation
          </p>
          <p className="font-grotesk mt-1 max-w-xs text-xs leading-5 text-neutral-500">
            Be the first to share what you think about this piece.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-neutral-100">
          <AnimatePresence initial={false}>
            {comments.map((comment: Comment, index) => (
              <motion.article
                key={comment.id}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{
                  duration: shouldReduceMotion ? 0 : 0.2,
                  delay: shouldReduceMotion ? 0 : Math.min(index, 6) * 0.025,
                }}
                className="flex items-start gap-3 overflow-hidden py-4 first:pt-1 last:pb-1"
              >
                <img
                  src={comment.profilePicture || BlankProfilePicture}
                  alt={`${comment.firstName}'s avatar`}
                  className="h-10 w-10 shrink-0 rounded-full border border-neutral-200 bg-neutral-100 object-cover"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                    <span className="font-helvetica text-sm font-semibold text-neutral-900">
                      {comment.firstName} {comment.lastName}
                    </span>
                    <time
                      dateTime={formatDateTime(comment.createdAt)}
                      className="font-grotesk text-[11px] text-neutral-400"
                    >
                      {formatTimeAgo(comment.createdAt)}
                    </time>
                    {comment.isOptimistic && (
                      <span className="font-grotesk text-[10px] text-neutral-400">
                        Sending…
                      </span>
                    )}
                    {currentUser?.id === comment.userId &&
                      !comment.isOptimistic && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(comment.id)}
                          disabled={isDeleting}
                          aria-label={`Delete your comment by ${comment.firstName}`}
                          className="font-grotesk ml-auto inline-flex min-h-8 items-center gap-1 rounded-lg px-2 text-[11px] font-medium text-neutral-400 transition-colors hover:bg-red-50 hover:text-red-700 focus-visible:ring-2 focus-visible:ring-red-300 focus-visible:outline-none disabled:opacity-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Delete
                        </button>
                      )}
                  </div>
                  <p className="font-grotesk mt-1 text-sm leading-6 break-words whitespace-pre-wrap text-neutral-700">
                    {comment.comment}
                  </p>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </div>
      )}

      {isLoadingMore && (
        <div
          className="font-grotesk flex items-center justify-center gap-2 py-4 text-xs text-neutral-500"
          role="status"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-indigo-500/30 border-t-indigo-600" />
          Loading more comments…
        </div>
      )}
      <div ref={sentinelRef} aria-hidden="true" className="h-2 w-full" />
    </section>
  );
};

export default ExploreCommentSection;
