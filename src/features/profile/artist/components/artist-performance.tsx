"use client";

import { usePostPerformance } from "../hooks/use-post-performance";
import { useInfiniteScroll } from "@/src/features/explore/hooks/use-infinite-scroll";
import Image from "next/image";
import {
  IconShoppingCart,
  IconMessageCircle,
  IconPhoto,
} from "@tabler/icons-react";

export const PostPerformanceDashboard = () => {
  const postPerformanceHookResult = usePostPerformance({ limit: 10 });

  const infiniteScrollResult = useInfiniteScroll({
    onLoadMore: postPerformanceHookResult.loadMore,
    hasNextPage: postPerformanceHookResult.hasNextPage,
    isLoadingMore: postPerformanceHookResult.isLoadingMore,
    threshold: 200,
    enabled: true,
  });

  const {
    posts,
    isLoading,
    isLoadingMore,
    error,
    hasNextPage,
    totalItems,
    canLoadMore,
    isEmpty,
  } = postPerformanceHookResult;

  const { sentinelRef } = infiniteScrollResult;

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-sm text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="mx-4 rounded-lg border border-red-200 bg-red-50 p-4 sm:p-6">
        <h3 className="mb-2 text-sm font-semibold text-red-800 sm:text-base">
          Error Loading Data
        </h3>
        <p className="text-xs text-red-600 sm:text-sm">{error}</p>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="mx-4 flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-6 sm:p-8">
        <IconPhoto className="mb-4 h-12 w-12 text-gray-400 sm:h-16 sm:w-16" />
        <h3 className="mb-2 text-base font-semibold text-gray-700 sm:text-lg">
          No Posts Yet
        </h3>
        <p className="text-center text-xs text-gray-500 sm:text-sm">
          Share your first artwork to see performance metrics here
        </p>
      </div>
    );
  }

  const totalOrders = posts.reduce((sum, post) => sum + post.ordersCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);

  return (
    <div className="space-y-4 p-4 sm:space-y-6 sm:p-0">
      {/* Summary Stats Cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 sm:text-sm">
                Total Posts
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:mt-2 sm:text-2xl">
                {totalItems}
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-2"></div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 sm:text-sm">
                Total Orders
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:mt-2 sm:text-2xl">
                {totalOrders}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2"></div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm sm:col-span-2 sm:p-5 lg:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-medium text-gray-600 sm:text-sm">
                Total Comments
              </p>
              <p className="mt-1 text-xl font-bold text-gray-900 sm:mt-2 sm:text-2xl">
                {totalComments}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-2"></div>
          </div>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm lg:block">
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <div className="col-span-1">Image</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2 text-center">Orders</div>
            <div className="col-span-2 text-center">Comments</div>
            <div className="col-span-3">Date Posted</div>
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div
              key={post.fileId}
              className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
            >
              <div className="col-span-1">
                <div className="relative h-12 w-12 overflow-hidden rounded-lg bg-gray-100">
                  <Image
                    src={post.url}
                    alt={post.title}
                    fill
                    className="object-cover"
                  />
                </div>
              </div>

              <div className="col-span-4 flex items-center">
                <p className="line-clamp-2 text-sm font-medium text-gray-900">
                  {post.title}
                </p>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">
                  {post.ordersCount}
                </span>
              </div>

              <div className="col-span-2 flex items-center justify-center">
                <span className="text-sm font-semibold text-gray-900">
                  {post.commentCount}
                </span>
              </div>

              <div className="col-span-3 flex items-center">
                <p className="text-sm text-gray-600">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="space-y-3 lg:hidden">
        {posts.map((post) => (
          <div
            key={post.fileId}
            className="rounded-lg border border-gray-200 bg-white p-3 shadow-sm transition-shadow hover:shadow-md sm:p-4"
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100 sm:h-20 sm:w-20">
                <Image
                  src={post.url}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex min-w-0 flex-1 flex-col justify-between">
                <div>
                  <h3 className="line-clamp-2 text-sm font-semibold text-gray-900 sm:text-base">
                    {post.title}
                  </h3>

                  <div className="mt-2 flex items-center gap-3 text-xs sm:gap-4 sm:text-sm">
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">
                        {post.ordersCount}
                      </span>
                      <span className="text-gray-500">orders</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="font-medium text-gray-700">
                        {post.commentCount}
                      </span>
                      <span className="text-gray-500">comments</span>
                    </div>
                  </div>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Infinite Scroll Trigger & Loading Indicator */}
      {canLoadMore && (
        <div
          ref={sentinelRef}
          className="flex h-10 w-full items-center justify-center"
        />
      )}

      {isLoadingMore && (
        <div className="flex items-center justify-center gap-2 py-4 text-sm text-gray-600">
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-orange-500 border-t-transparent"></div>
          <span>Loading more posts...</span>
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="text-center text-xs text-gray-500 sm:text-sm">
          No more posts to load
        </p>
      )}

      {/* Showing Count */}
      <p className="text-center text-xs text-gray-500 sm:text-sm">
        Showing {posts.length} of {totalItems} posts
      </p>
    </div>
  );
};
