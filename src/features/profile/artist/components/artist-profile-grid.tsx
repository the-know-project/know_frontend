"use client";

import { ArtistProfileToggle } from "@/src/constants/constants";
import { formatDateToReadable } from "@/src/utils/date";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import InfiniteLoadingIndicator from "../../../explore/components/infinite-loading-indicator";
import { useInfiniteScroll } from "../../../explore/hooks/use-infinite-scroll";
import ProfileCard from "../../components/profile-card";
import { TUserAssetData } from "../dto/artist.dto";
import { useSimpleInfiniteUserPosts } from "../hooks/use-fetch-user-posts";
import { IUser } from "@/src/features/auth/state/interface/auth.interface";
import Stats from "./artist-stats";
import ProfileCardSkeletonGrid from "../../layout/profile-card-skeleton";
import { useCanFetchData } from "@/src/features/auth/hooks/use-optimized-auth";
import { showLog } from "@/src/utils/logger";
import ArtistCollection from "./artist-collection";

interface ArtistProfileGridProps {
  user: IUser;
}

const ArtistProfileGrid = ({ user }: ArtistProfileGridProps) => {
  const canFetch = useCanFetchData();
  const [activeToggle, setActiveToggle] = useState<string>("posts");
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const tabContainerRef = useRef<HTMLDivElement>(null);
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });

  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeToggle);
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeToggle]);

  const postsHookResult = useSimpleInfiniteUserPosts({
    userId: user.id,
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
    if (!canFetch || posts.length === 0) {
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
              className="flex w-full max-w-sm space-y-[50px] lg:max-w-none"
            >
              <ProfileCard
                id={post.fileId}
                title={post.name}
                views={post.numOfViews}
                createdAt={formatDateToReadable(post.createdAt.toString())}
                image={post.url}
                role={user.role as string}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div className="flex w-full justify-center py-4 lg:col-span-2">
            <InfiniteLoadingIndicator />
          </div>
        )}

        {/* Sentinel element for intersection observer */}
        {canLoadMore && (
          <div
            ref={sentinelRef}
            className="flex h-10 w-full items-center justify-center lg:col-span-2"
          />
        )}

        {!hasNextPage && posts.length > 0 && (
          <div className="w-full py-8 text-center lg:col-span-2">
            <p className="font-bricolage text-sm text-gray-400">
              You've reached the end of the posts
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="lg:px- -mt-[50px] flex w-full flex-col px-4">
      <div className="w-full items-center justify-center">
        <div
          ref={tabContainerRef}
          className="relative flex flex-row items-center justify-between"
        >
          {ArtistProfileToggle.map((toggle) => (
            <button
              key={toggle.id}
              ref={(el) => {
                if (el) tabRefs.current.set(toggle.name, el);
              }}
              className="flex flex-1 flex-col items-center"
              onClick={() => setActiveToggle(toggle.name)}
            >
              <p
                className={`font-bebas text-[16px] tracking-wider capitalize hover:scale-105 active:scale-95 lg:text-[18px] ${
                  activeToggle === toggle.name
                    ? "font-semibold text-neutral-900 transition-colors duration-300"
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
            className="absolute bottom-0 h-[2px] rounded-full bg-gray-900 transition-all duration-300"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          ></div>
        </div>
      </div>
      <div className="mt-4 flex w-full flex-col items-center justify-center gap-4 bg-white lg:grid lg:grid-cols-2 lg:items-start lg:justify-start lg:gap-6">
        {activeToggle === "posts" && renderPostsContent()}
        {activeToggle === "stats" && (
          <div className="flex w-full flex-col items-center justify-center lg:col-span-2">
            <Stats />
          </div>
        )}
        {activeToggle === "collections" && (
          <div className="flex w-full flex-col items-center justify-center py-20 lg:col-span-2">
            <ArtistCollection />
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistProfileGrid;
