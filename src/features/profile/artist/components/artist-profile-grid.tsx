"use client";

import { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArtistProfileToggle } from "@/src/constants/constants";
import ProfileCard from "../../components/profile-card";
import { useSimpleInfiniteUserPosts } from "../hooks/use-fetch-user-posts";
import { useInfiniteScroll } from "../../../explore/hooks/use-infinite-scroll";
import InfiniteLoadingIndicator from "../../../explore/components/infinite-loading-indicator";
import { TUserAssetData } from "../dto/artist.dto";
import { formatDateToReadable } from "@/src/utils/date";

interface ArtistProfileGridProps {
  userId?: string;
}

const ProfileCardSkeletonGrid = () => (
  <div className="grid grid-cols-2 gap-4">
    {Array.from({ length: 8 }).map((_, index) => (
      <div key={index} className="animate-pulse">
        <div className="mb-2 aspect-square rounded-lg bg-gray-200"></div>
        <div className="mb-1 h-4 rounded bg-gray-200"></div>
        <div className="h-3 w-3/4 rounded bg-gray-200"></div>
      </div>
    ))}
  </div>
);

const ArtistProfileGrid = ({ userId }: ArtistProfileGridProps) => {
  const [activeToggle, setActiveToggle] = useState<string>("posts");

  const postsHookResult = useSimpleInfiniteUserPosts({
    userId,
    limit: 12,
  });

  const infiniteScrollResult = useInfiniteScroll({
    onLoadMore: postsHookResult.loadMore,
    hasNextPage: postsHookResult.hasNextPage,
    isLoadingMore: postsHookResult.isLoadingMore,
    threshold: 200,
    enabled: activeToggle === "posts",
  });

  const {
    posts,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    isEmpty,
    canLoadMore,
  } = postsHookResult;

  const { sentinelRef } = infiniteScrollResult;

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const renderPostsContent = () => {
    if (isLoading && posts.length === 0) {
      return <ProfileCardSkeletonGrid />;
    }

    if (error && posts.length === 0) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <p className="font-bricolage mb-4 text-gray-500">
              Failed to load posts: {error}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="button_base px-4 py-2"
            >
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="col-span-2 flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <p className="font-bricolage text-gray-500">No posts found</p>
          </div>
        </div>
      );
    }

    return (
      <>
        <AnimatePresence>
          {posts.map((post: TUserAssetData, index: number) => (
            <motion.div
              key={post.fileId}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: Math.min(index, 20) * 0.05,
                ease: "easeInOut",
                duration: 0.09,
              }}
            >
              <ProfileCard
                id={post.fileId}
                title={post.name}
                views={post.numOfViews}
                createdAt={formatDateToReadable(post.createdAt.toString())}
                image={post.url}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div className="col-span-2 flex justify-center py-4">
            <InfiniteLoadingIndicator />
          </div>
        )}

        {/* Sentinel element for intersection observer */}
        {canLoadMore && (
          <div
            ref={sentinelRef}
            className="col-span-2 flex h-10 items-center justify-center"
          />
        )}

        {!hasNextPage && posts.length > 0 && (
          <div className="col-span-2 py-8 text-center">
            <p className="font-bricolage text-sm text-gray-400">
              You've reached the end of the posts
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="flex w-full flex-col">
      <div className="relative flex flex-row items-center justify-between">
        {ArtistProfileToggle.map((toggle) => (
          <button
            key={toggle.id}
            className="flex flex-1 flex-col items-start"
            onClick={() => setActiveToggle(toggle.name)}
          >
            <p
              className={`font-bricolage capitalize hover:scale-105 active:scale-95 ${
                activeToggle === toggle.name
                  ? "font-semibold text-black transition-colors duration-300"
                  : "text-neutral-500"
              }`}
            >
              {toggle.name}
            </p>
          </button>
        ))}
        {/* Continuous line background */}
        <div className="absolute right-0 bottom-0 left-0 h-[2px] bg-gray-300"></div>
        {/* Active section highlight */}
        <div
          className={`absolute bottom-0 h-[2px] bg-black transition-all duration-300 ${
            activeToggle === "posts"
              ? "left-0 w-1/4 rounded-[15px]"
              : activeToggle === "stats"
                ? "left-1/4 w-1/4 rounded-[15px]"
                : "left-[67%] w-[33%] rounded-[15px]"
          }`}
        ></div>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-4 bg-white">
        {activeToggle === "posts" && renderPostsContent()}
        {activeToggle === "stats" && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20">
            <p className="font-bricolage text-gray-500">Stats coming soon...</p>
          </div>
        )}
        {activeToggle === "drafts" && (
          <div className="col-span-2 flex flex-col items-center justify-center py-20">
            <p className="font-bricolage text-gray-500">
              Collections coming soon...
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistProfileGrid;
