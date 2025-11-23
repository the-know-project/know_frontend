"use client";

import { useState } from "react";
import { usePostPerformance } from "../hooks/use-post-performance";
import Image from "next/image";
import {
  IconShoppingCart,
  IconMessageCircle,
  IconTrendingUp,
  IconPhoto,
} from "@tabler/icons-react";

export const PostPerformanceDashboard = () => {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  const { data, isLoading, isError, error } = usePostPerformance({
    page,
    limit,
  });

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"></div>
          <p className="text-sm text-gray-600">Loading performance data...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <h3 className="mb-2 font-semibold text-red-800">Error Loading Data</h3>
        <p className="text-sm text-red-600">
          {error?.message || "Failed to fetch post performance"}
        </p>
      </div>
    );
  }

  if (!data?.posts || data.posts.length === 0) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
        <IconPhoto className="mb-4 h-16 w-16 text-gray-400" />
        <h3 className="mb-2 text-lg font-semibold text-gray-700">
          No Posts Yet
        </h3>
        <p className="text-center text-sm text-gray-500">
          Share your first artwork to see performance metrics here
        </p>
      </div>
    );
  }

  const posts = data.posts;
  const meta = data.meta;

  // Calculate total stats
  const totalOrders = posts.reduce((sum, post) => sum + post.ordersCount, 0);
  const totalComments = posts.reduce((sum, post) => sum + post.commentCount, 0);

  return (
    <div className="space-y-6">
      {/* Summary Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        {/* Total Posts */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Posts</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {meta.totalItems}
              </p>
            </div>
            <div className="rounded-full bg-orange-100 p-2"></div>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalOrders}
              </p>
            </div>
            <div className="rounded-full bg-green-100 p-2"></div>
          </div>
        </div>

        {/* Total Comments */}
        <div className="rounded-lg border border-gray-200 bg-white p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Comments
              </p>
              <p className="mt-2 text-2xl font-bold text-gray-900">
                {totalComments}
              </p>
            </div>
            <div className="rounded-full bg-purple-100 p-2"></div>
          </div>
        </div>
      </div>

      {/* Posts Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        {/* Table Header */}
        <div className="border-b border-gray-200 bg-gray-50 px-6 py-3">
          <div className="grid grid-cols-12 gap-4 text-xs font-semibold tracking-wider text-gray-600 uppercase">
            <div className="col-span-1">Image</div>
            <div className="col-span-4">Title</div>
            <div className="col-span-2 text-center">Orders</div>
            <div className="col-span-2 text-center">Comments</div>
            <div className="col-span-3">Date Posted</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {posts.map((post) => (
            <div
              key={post.fileId}
              className="grid grid-cols-12 gap-4 px-6 py-4 transition-colors hover:bg-gray-50"
            >
              {/* Image */}
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

              {/* Title */}
              <div className="col-span-4 flex items-center">
                <p className="line-clamp-2 text-sm font-medium text-gray-900">
                  {post.title}
                </p>
              </div>

              {/* Orders Count */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {post.ordersCount}
                  </span>
                </div>
              </div>

              {/* Comments Count */}
              <div className="col-span-2 flex items-center justify-center">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-900">
                    {post.commentCount}
                  </span>
                </div>
              </div>

              {/* Date */}
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

        {/* Pagination */}
        {meta.totalPages > 1 && (
          <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-600">
                Showing page {meta.currentPage} of {meta.totalPages} (
                {meta.totalItems} total posts)
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={!meta.hasPreviousPage}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>

                <span className="px-4 text-sm font-medium text-gray-700">
                  {meta.currentPage}
                </span>

                <button
                  onClick={() => setPage((p) => p + 1)}
                  disabled={!meta.hasNextPage}
                  className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
