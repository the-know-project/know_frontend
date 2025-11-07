"use client";

import { useState } from "react";
import { IconTrendingUp } from "@tabler/icons-react";
import { StaticImageData } from "next/image";
import Image from "next/image";
import { useFetchPostPerformance } from "../hooks/use-fetch-post-performance";

interface IPostPerformance {
  id: string;
  title: string;
  published: string;
  src: string | StaticImageData;
  views: number;
  totalLikes: number;
  totalSales: number;
}

type SortBy = "views" | "likes" | "sales";

const ArtistPerformance = () => {
  const [sortBy, setSortBy] = useState<SortBy>("views");
  const { data: posts, isLoading } = useFetchPostPerformance();

  const handleSort = (column: SortBy) => {
    setSortBy(column);
  };

  // Sort posts based on selected column
  const sortedPosts = posts
    ? [...posts].sort((a, b) => {
        if (sortBy === "views") return b.views - a.views;
        if (sortBy === "likes") return b.totalLikes - a.totalLikes;
        return b.totalSales - a.totalSales;
      })
    : [];

  if (isLoading) {
    return (
      <section className="flex w-full flex-col py-12">
        <div className="mb-6 flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <IconTrendingUp className="h-5 w-5 text-orange-500" />
          </div>
          <h2 className="stats_title">Posts Performance</h2>
        </div>
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="grid grid-cols-4 items-center gap-6 py-4 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-xl bg-gray-200"></div>
                <div className="flex-1">
                  <div className="h-4 w-32 rounded bg-gray-200 mb-2"></div>
                  <div className="h-3 w-24 rounded bg-gray-200"></div>
                </div>
              </div>
              <div className="h-4 w-12 rounded bg-gray-200 mx-auto"></div>
              <div className="h-4 w-12 rounded bg-gray-200 mx-auto"></div>
              <div className="h-4 w-12 rounded bg-gray-200 mx-auto"></div>
            </div>
          ))}
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
          <button
            onClick={() => handleSort("views")}
            className="text-center hover:text-neutral-900 transition-colors cursor-pointer"
          >
            VIEWS {sortBy === "views" && "↓"}
          </button>
          <button
            onClick={() => handleSort("likes")}
            className="text-center hover:text-neutral-900 transition-colors cursor-pointer"
          >
            LIKES {sortBy === "likes" && "↓"}
          </button>
          <button
            onClick={() => handleSort("sales")}
            className="text-center hover:text-neutral-900 transition-colors cursor-pointer"
          >
            SALES {sortBy === "sales" && "↓"}
          </button>
        </div>

        {/* Table Body */}
        <div className="space-y-6">
          {sortedPosts.length === 0 ? (
            <div className="py-12 text-center">
              <p className="font-bricolage text-gray-500">No posts found</p>
            </div>
          ) : (
            sortedPosts.map((post, index) => (
              <div
                key={post.id}
                className="motion-preset-blur-down motion-duration-300 grid grid-cols-4 items-center gap-6 py-4"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {/* Post Column */}
                <div className="flex items-center gap-4">
                  <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl">
                    <Image
                      src={post.src}
                      alt={post.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="font-bricolage hidden truncate text-lg font-semibold text-neutral-900 sm:block">
                      {post.title}
                    </h3>
                    <p className="stats_content hidden !text-sm capitalize md:block">
                      Published {post.published}
                    </p>
                  </div>
                </div>
                {/* Views Column */}
                <div className="text-center">
                  <span className="font-bricolage text-lg font-semibold text-neutral-900">
                    {post.views.toLocaleString()}
                  </span>
                </div>
                {/* Likes Column */}
                <div className="text-center">
                  <span className="font-bricolage text-lg font-semibold text-neutral-900">
                    {post.totalLikes.toLocaleString()}
                  </span>
                </div>
                {/* Sales Column */}
                <div className="text-center">
                  <span className="font-bricolage text-lg font-semibold text-neutral-900">
                    {post.totalSales.toLocaleString()}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default ArtistPerformance;
