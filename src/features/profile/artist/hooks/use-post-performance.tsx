import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";

import {
  PostPerformanceError,
  PostPerformanceUnauthorizedError,
} from "@/src/features/profile/artist/error/artist.error";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { useRoleStore } from "@/src/features/auth/state/store";
import { useCanFetchData } from "@/src/features/auth/hooks/use-optimized-auth";
import type { PostPerformanceResponse } from "../dto/post-performance.dto";
import { getPostPerformance } from "@/src/features/metrics/api/post-performance/post-performance.api";

interface UsePostPerformanceOptions {
  userId?: string;
  limit?: number;
}

interface PostPerformanceItem {
  title: string;
  url: string;
  fileId: string;
  ordersCount: number;
  commentCount: number;
  createdAt: string;
}

export const usePostPerformance = ({
  userId,
  limit = 10,
}: UsePostPerformanceOptions = {}) => {
  const canFetch = useCanFetchData();
  const currentUserId = useTokenStore(selectUserId);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);
  const role = useRoleStore((state) => state.role);

  const targetUserId = userId || currentUserId;

  const [allPosts, setAllPosts] = useState<PostPerformanceItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const { data, isLoading, error } = useQuery({
    queryKey: ["postPerformance", targetUserId, currentPage, limit],
    queryFn: async (): Promise<PostPerformanceResponse> => {
      if (!targetUserId) {
        throw new PostPerformanceUnauthorizedError();
      }

      const result = await ResultAsync.fromPromise(
        getPostPerformance({
          userId: targetUserId,
          page: currentPage,
          limit,
        }),
        (error) =>
          new PostPerformanceError(
            `Error fetching post performance: ${error instanceof Error ? error.message : String(error)}`,
          ),
      ).andThen((data: any) => {
        if (data.status === 200) {
          return ok(data as PostPerformanceResponse);
        } else {
          return err(
            new PostPerformanceError("Failed to fetch post performance"),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    enabled:
      canFetch &&
      isAuthenticated &&
      hasToken &&
      hasHydrated &&
      !!targetUserId &&
      role === "ARTIST",
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });

  useEffect(() => {
    setAllPosts([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setTotalItems(0);
    setIsLoadingMore(false);
  }, [targetUserId]);

  useEffect(() => {
    if (data?.data) {
      const { data: newPosts, meta } = data;

      setTotalPages(meta?.totalPages || 0);
      setTotalItems(meta?.totalItems || 0);
      setHasNextPage(meta?.hasNextPage || false);

      if (currentPage === 1) {
        setAllPosts(newPosts || []);
      } else {
        setAllPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.fileId));
          const uniqueNewPosts = (newPosts || []).filter(
            (post: PostPerformanceItem) => !existingIds.has(post.fileId),
          );
          return [...prevPosts, ...uniqueNewPosts];
        });
      }
    }
  }, [data, currentPage]);

  useEffect(() => {
    if (isLoading && currentPage > 1) {
      setIsLoadingMore(true);
    } else {
      setIsLoadingMore(false);
    }
  }, [isLoading, currentPage]);

  const loadMore = useCallback(() => {
    if (hasNextPage && !isLoading && !isLoadingMore) {
      setCurrentPage((prev) => prev + 1);
    }
  }, [hasNextPage, isLoading, isLoadingMore]);

  const refresh = useCallback(() => {
    setAllPosts([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setTotalItems(0);
    setIsLoadingMore(false);
  }, []);

  return {
    posts: allPosts,
    currentPage,
    hasNextPage,
    totalPages,
    totalItems,

    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error: error?.message || null,

    loadMore,
    refresh,

    isEmpty: allPosts.length === 0 && !isLoading,
    canLoadMore: hasNextPage && !isLoading && !isLoadingMore,
  };
};
