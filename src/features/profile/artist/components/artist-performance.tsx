"use client";

import Image from "next/image";
import {
  CalendarDays,
  Image as ImageIcon,
  MessageCircle,
  PackageOpen,
  RefreshCw,
  ShoppingCart,
} from "lucide-react";
import { usePostPerformance } from "../hooks/use-post-performance";
import { useInfiniteScroll } from "@/src/features/explore/hooks/use-infinite-scroll";

const numberFormatter = new Intl.NumberFormat("en");
const dateFormatter = new Intl.DateTimeFormat("en", {
  year: "numeric",
  month: "short",
  day: "numeric",
});

const formatPostDate = (value: string) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "Date unavailable"
    : dateFormatter.format(date);
};

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
    refetch,
  } = postPerformanceHookResult;

  const { sentinelRef } = infiniteScrollResult;

  if (isLoading) {
    return (
      <div
        aria-label="Loading post performance"
        aria-busy="true"
        className="space-y-4"
      >
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-24 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div
              key={index}
              className="h-20 animate-pulse rounded-2xl bg-neutral-100"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-start gap-3 rounded-2xl border border-red-200 bg-red-50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-helvetica font-bold text-red-900">
            Performance data could not load
          </h3>
          <p className="font-grotesk mt-1 text-sm text-red-700">{error}</p>
        </div>
        <button
          type="button"
          onClick={() => void refetch()}
          className="font-grotesk inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-red-200 bg-white px-4 text-sm font-semibold text-red-800 transition hover:bg-red-100"
        >
          <RefreshCw className="h-4 w-4" />
          Try again
        </button>
      </div>
    );
  }

  if (isEmpty) {
    return (
      <div className="flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-neutral-300 bg-neutral-50 px-5 py-10 text-center sm:min-h-72">
        <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-neutral-500 shadow-sm ring-1 ring-neutral-200">
          <PackageOpen className="h-7 w-7" />
        </div>
        <h3 className="font-helvetica mt-4 text-lg font-bold text-neutral-900">
          Your post insights will show up here
        </h3>
        <p className="font-grotesk mt-1 max-w-sm text-sm leading-6 text-neutral-500">
          Publish artwork to see its orders and comments together in one place.
        </p>
      </div>
    );
  }

  const totalOrders = posts.reduce((sum, post) => sum + post.ordersCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);
  const summary = [
    {
      label: "Posts",
      value: totalItems || posts.length,
      detail: "published",
      icon: ImageIcon,
      color: "bg-orange-50 text-orange-700",
    },
    {
      label: "Orders",
      value: totalOrders,
      detail: "on loaded posts",
      icon: ShoppingCart,
      color: "bg-emerald-50 text-emerald-700",
    },
    {
      label: "Comments",
      value: totalComments,
      detail: "on loaded posts",
      icon: MessageCircle,
      color: "bg-violet-50 text-violet-700",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {summary.map(({ label, value, detail, icon: Icon, color }) => (
          <article
            key={label}
            className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-3 shadow-sm sm:p-4"
          >
            <div className="flex items-center gap-2">
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-xl ${color}`}
              >
                <Icon className="h-4 w-4" />
              </span>
              <span className="font-grotesk truncate text-[11px] font-medium text-neutral-600 sm:text-sm">
                {label}
              </span>
            </div>
            <p className="font-helvetica mt-3 text-xl font-bold text-neutral-950 tabular-nums sm:text-2xl">
              {numberFormatter.format(value)}
            </p>
            <p className="font-grotesk mt-0.5 text-[10px] leading-4 text-neutral-500 sm:text-[11px]">
              {detail}
            </p>
          </article>
        ))}
      </div>

      <div className="flex items-center justify-between gap-3 px-1">
        <div>
          <h3 className="font-helvetica text-base font-bold text-neutral-900 sm:text-lg">
            Artwork performance
          </h3>
          <p className="font-grotesk mt-1 text-xs text-neutral-500 sm:text-sm">
            Orders and comments for each post
          </p>
        </div>
        <span className="font-grotesk shrink-0 rounded-full bg-neutral-100 px-3 py-1.5 text-xs font-medium text-neutral-600">
          {numberFormatter.format(posts.length)} of{" "}
          {numberFormatter.format(totalItems || posts.length)}
        </span>
      </div>

      <div className="hidden overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm lg:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left">
            <thead className="bg-neutral-50">
              <tr className="font-grotesk border-b border-neutral-200 text-xs font-semibold tracking-wide text-neutral-500 uppercase">
                <th scope="col" className="px-5 py-3 font-semibold">
                  Artwork
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  Orders
                </th>
                <th scope="col" className="px-4 py-3 text-center font-semibold">
                  Comments
                </th>
                <th scope="col" className="px-5 py-3 font-semibold">
                  Published
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {posts.map((post) => (
                <tr
                  key={post.fileId}
                  className="transition-colors hover:bg-neutral-50"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5">
                        <Image
                          src={post.url}
                          alt={post.title}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <p className="font-helvetica max-w-[340px] truncate text-sm font-semibold text-neutral-800">
                        {post.title}
                      </p>
                    </div>
                  </td>
                  <td className="font-grotesk px-4 py-3.5 text-center text-sm font-semibold text-neutral-800 tabular-nums">
                    {numberFormatter.format(post.ordersCount)}
                  </td>
                  <td className="font-grotesk px-4 py-3.5 text-center text-sm font-semibold text-neutral-800 tabular-nums">
                    {numberFormatter.format(post.commentCount)}
                  </td>
                  <td className="font-grotesk px-5 py-3.5 text-sm text-neutral-500">
                    {formatPostDate(post.createdAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="space-y-3 lg:hidden">
        {posts.map((post) => (
          <article
            key={post.fileId}
            className="rounded-2xl border border-neutral-200 bg-white p-3.5 shadow-sm transition-shadow hover:shadow-md sm:p-4"
          >
            <div className="flex gap-3 sm:gap-4">
              <div className="relative h-[76px] w-[76px] shrink-0 overflow-hidden rounded-xl bg-neutral-100 ring-1 ring-black/5 sm:h-20 sm:w-20">
                <Image
                  src={post.url}
                  alt={post.title}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="flex min-w-0 flex-1 flex-col justify-between gap-3">
                <h4 className="font-helvetica line-clamp-2 text-sm leading-5 font-semibold text-neutral-900 sm:text-base">
                  {post.title}
                </h4>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="font-grotesk inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-emerald-50 px-2.5 text-xs font-medium text-emerald-800">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    {numberFormatter.format(post.ordersCount)} orders
                  </span>
                  <span className="font-grotesk inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-violet-50 px-2.5 text-xs font-medium text-violet-800">
                    <MessageCircle className="h-3.5 w-3.5" />
                    {numberFormatter.format(post.commentCount)} comments
                  </span>
                </div>
              </div>
            </div>
            <div className="font-grotesk mt-3 flex items-center gap-1.5 border-t border-neutral-100 pt-3 text-xs text-neutral-500">
              <CalendarDays className="h-3.5 w-3.5" />
              Published {formatPostDate(post.createdAt)}
            </div>
          </article>
        ))}
      </div>

      {canLoadMore && (
        <div ref={sentinelRef} aria-hidden="true" className="h-2 w-full" />
      )}

      {isLoadingMore && (
        <div
          className="font-grotesk flex items-center justify-center gap-2 py-4 text-sm text-neutral-500"
          role="status"
        >
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-orange-500/30 border-t-orange-500" />
          Loading more posts…
        </div>
      )}

      {!hasNextPage && posts.length > 0 && (
        <p className="font-grotesk border-t border-neutral-200 pt-4 text-center text-xs text-neutral-500">
          You’re all caught up
        </p>
      )}
    </div>
  );
};
