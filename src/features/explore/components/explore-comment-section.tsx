"use client";

import { Separator } from "@/src/shared/ui/separator";
import { Textarea } from "@/src/shared/ui/textarea";

const ExploreCommentSection = () => {
  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Adding comment...");
  };

  const comments = [
    {
      id: 1,
      username: "Mark Angel",
      timeAgo: "2 days ago",
      comment: "Well done!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 2,
      username: "Olurotimi Adegboja",
      timeAgo: "4 days ago",
      comment: "This is so sick",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 3,
      username: "Constantine",
      timeAgo: "4 days ago",
      comment: "This is beautiful",
      avatar:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 4,
      username: "Olurotimi Adegboja",
      timeAgo: "4 days ago",
      comment: "This is so sick",
      avatar:
        "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    },
    {
      id: 5,
      username: "Mark Angel",
      timeAgo: "2 days ago",
      comment: "Well done!",
      avatar:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=face",
    },
  ];

  return (
    <div className="mx-auto rounded-lg border border-gray-100 bg-white p-6 shadow-sm">
      {/* Comment input section */}
      <div className="mb-20 flex items-start gap-3">
        <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gray-300">
          <img
            src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face"
            alt="Your avatar"
            className="h-full w-full rounded-full object-cover"
          />
        </div>
        <div className="flex-1">
          <Textarea
            placeholder="What are your thoughts on this project?"
            className="w-full bg-transparent text-sm text-gray-700 placeholder-gray-500 outline-none"
          />
          <div className="mt-2 flex justify-end">
            <button className="rounded bg-gray-300 px-4 py-1 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-400">
              Share your work
            </button>
          </div>
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-10">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-3">
            <div className="h-10 w-10 flex-shrink-0 rounded-full">
              <img
                src={comment.avatar}
                alt={`${comment.username}'s avatar`}
                className="h-full w-full rounded-full object-cover"
              />
            </div>
            <div className="flex-1">
              <div className="mb-1 flex items-center gap-2">
                <span className="text-sm font-semibold text-gray-900">
                  {comment.username}
                </span>
                <span className="text-xs text-gray-500">
                  • {comment.timeAgo}
                </span>
              </div>
              <p className="text-sm text-gray-700">{comment.comment}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-center">
        <button className="flex items-center justify-center gap-1 text-sm font-medium text-blue-600 transition-colors hover:text-blue-700">
          See all comments
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
    </div>
  );
};

export default ExploreCommentSection;
