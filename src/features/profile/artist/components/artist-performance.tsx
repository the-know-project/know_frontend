// src/features/profile/artist/components/artist-performance.tsx
"use client";

import { IconTrendingUp } from "@tabler/icons-react";
import Image from "next/image";
import Spinner from "@/src/shared/components/spinner";
import { usePostPerformance } from "../hooks/use-post-performance";
import { useAuth } from "@/src/features/auth/hooks/use-auth";

const ArtistPerformance = () => {
  const { role } = useAuth();
  const { data: posts, isLoading, isError, error } = usePostPerformance();

  // Show message for non-artists
  if (role !== "ARTIST") {
    return (
      <section className="flex w-full flex-col py-12">
        <div className="mb-6 flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <IconTrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="stats_title">Posts Performance</h2>
        </div>
        <div className="flex h-64 w-full items-center justify-center">
          <p className="stats_content">
            This feature is only available for artists
          </p>
        </div>
      </section>
    );
  }

  if (isLoading) {
    return (
      <section className="flex w-full flex-col py-12">
        <div className="mb-6 flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <IconTrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="stats_title">Posts Performance</h2>
        </div>
        <div className="flex h-64 w-full items-center justify-center">
          <Spinner />
        </div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="flex w-full flex-col py-12">
        <div className="mb-6 flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <IconTrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="stats_title">Posts Performance</h2>
        </div>
        <div className="flex h-64 w-full items-center justify-center">
          <p className="text-red-500">
            {error?.message || "Failed to load performance data"}
          </p>
        </div>
      </section>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <section className="flex w-full flex-col py-12">
        <div className="mb-6 flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <IconTrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="stats_title">Posts Performance</h2>
        </div>
        <div className="flex h-64 w-full items-center justify-center">
          <p className="stats_content">No posts found</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex w-full flex-col py-12">
      <div className="mb-6 flex items-center gap-8">
        <div className="rounded-full bg-orange-100 p-2">
          <IconTrendingUp className="h-5 w-5 text-orange-500" />
        </div>
        <h2 className="stats_title">Posts Performance</h2>
      </div>
      <div className="w-full">
        {/* Table Header */}
        <div className="stats_content grid grid-cols-4 gap-6 pb-6 text-xs tracking-wider !uppercase">
          <div>POST</div>
          <div className="text-center">VIEWS</div>
          <div className="text-center">LIKES</div>
          <div className="text-center">SALES</div>
        </div>

        {/* Table Body */}
        <div className="space-y-6">
          {posts.map((post, index) => (
            <div
              key={post?.id || index}
              className="motion-preset-blur-down motion-duration-300 grid grid-cols-4 items-center gap-6 py-4"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Post Column */}
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl bg-gray-100">
                  {post?.src && (
                    <Image
                      src={post.src}
                      alt={post?.title || "Post"}
                      fill
                      className="object-cover"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <h3 className="font-bricolage hidden truncate text-lg font-semibold text-neutral-900 sm:block">
                    {post?.title || "Untitled"}
                  </h3>
                  <p className="stats_content hidden !text-sm capitalize md:block">
                    Published {post?.published || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Views Column */}
              <div className="text-center">
                <span className="font-bricolage text-lg font-semibold text-neutral-900">
                  {(post?.views ?? 0).toLocaleString()}
                </span>
              </div>

              {/* Likes Column */}
              <div className="text-center">
                <span className="font-bricolage text-lg font-semibold text-neutral-900">
                  {(post?.totalLikes ?? 0).toLocaleString()}
                </span>
              </div>

              {/* Sales Column */}
              <div className="text-center">
                <span className="font-bricolage text-lg font-semibold text-neutral-900">
                  {(post?.totalSales ?? 0).toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ArtistPerformance;
