"use client";

import { useQuery } from "@tanstack/react-query";

interface PostPerformanceData {
  id: string;
  title: string;
  published: string;
  src: string;
  views: number;
  totalLikes: number;
  totalSales: number;
}

export const useFetchPostPerformance = () => {
  return useQuery({
    queryKey: ["post-performance"],
    queryFn: async () => {
      const response = await fetch("/api/artist/post-performance");

      if (!response.ok) {
        throw new Error("Failed to fetch post performance");
      }

      const data = await response.json();
      return data.posts as PostPerformanceData[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
