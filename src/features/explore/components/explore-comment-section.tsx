"use client";

import { useState } from "react";
import { Textarea } from "@/src/shared/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { usePostComments } from "../hooks/use-post-comments";
import { showLog } from "@/src/utils/logger";
import { AnimatePresence, motion } from "framer-motion";
import { Comment } from "../state/interface/explore-comment.interface";
import { BlankProfilePicture } from "@/src/constants/constants";
import { Send } from "lucide-react";

interface ExploreCommentSectionProps {
  fileId: string;
}

const ExploreCommentSection = ({ fileId }: ExploreCommentSectionProps) => {
  const {
    comments,
    currentUser,
    sentinelRef,
    isLoadingInitial,
    isLoadingMore,
    isAdding,
    addComment,
    deleteComment,
  } = usePostComments({
    fileId,
  });

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

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
              className="font-grotesk ringed-none w-full bg-transparent text-xs font-light text-neutral-600 focus:ring-0 focus:outline-none sm:text-sm"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              disabled={isAdding}
            />
            {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
            <div className="mt-2 flex justify-end">
              <button
                type="submit"
                disabled={isAdding || !commentText.trim()}
                className="font-bebas rounded bg-[#1E3A8A] px-4 py-1 text-sm font-medium tracking-wider text-white transition-colors disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isAdding ? (
                  <Send className="h-4 w-4 text-neutral-600" />
                ) : (
                  <Send className="h-4 w-4 text-white" />
                )}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isLoadingInitial ? (
        <div className="py-8 text-center">
          <p className="font-grotesk text-xs font-light text-neutral-600 sm:text-sm">
            Loading comments...
          </p>
        </div>
      ) : comments.length === 0 ? (
        <div className="py-8 text-center">
          <p className="font-grotesk text-xs font-light text-neutral-600 sm:text-sm">
            No comments yet. Be the first to comment!
          </p>
        </div>
      ) : (
        <div className="space-y-10">
          <AnimatePresence></AnimatePresence>
          {comments.map((comment: Comment, index) => {
            return (
              <motion.div
                key={comment.id}
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  delay: Math.min(index, 20) * 0.05,
                  ease: "easeInOut",
                  duration: 0.09,
                }}
                className={`flex items-start gap-3 transition-opacity duration-200`}
              >
                <div className="h-10 w-10 flex-shrink-0 rounded-full">
                  <img
                    src={comment.profilePicture || BlankProfilePicture}
                    alt={`${comment.firstName}'s avatar`}
                    className="h-full w-full rounded-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <div className="mb-1 flex flex-col items-start">
                    <span className="font-helvetica text-sm font-bold text-nowrap text-neutral-800 capitalize sm:text-[16px]">
                      {comment.firstName} {comment.lastName}
                    </span>
                    <span className="font-grotesk text-[12px] font-light text-neutral-600">
                      • {formatTimeAgo(comment.createdAt)}
                    </span>
                  </div>
                  <p className="font-grotesk text-sm font-light text-neutral-600">
                    {comment.comment}
                  </p>
                </div>
              </motion.div>
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
