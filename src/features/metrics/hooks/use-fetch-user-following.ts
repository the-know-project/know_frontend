import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { fetchUserFollowing } from "../api/user-following/route";
import { MetricsError } from "../error/metrics.error";
import {
  IFetchUserFollowing,
  IFetchUserFollowingResponse,
  IFollowingData,
} from "../types/metrics.types";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";
import { useCallback, useEffect, useState } from "react";
import { useFollowStore } from "../state/store/metrics.store";

type FetchUserFollowingParams = Omit<IFetchUserFollowing, "userId" | "page">;

export const useFetchUserFollowing = (params: FetchUserFollowingParams) => {
  const { limit = 10 } = params;
  const canFetch = useCanFetchData();
  const userId = useTokenStore(selectUserId);
  const addFollowings = useFollowStore((state) => state.addFollowings);

  const [allFollowing, setAllFollowing] = useState<IFollowingData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const queryParams = {
    userId,
    page: currentPage,
    limit,
  };

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: [`user-following`, { userId, page: currentPage, limit }],
    queryFn: async () => {
      if (!userId) {
        throw new MetricsError("User ID is required to fetch following list");
      }
      const result = await ResultAsync.fromPromise(
        fetchUserFollowing({ userId, page: currentPage, limit }),
        (error) =>
          new MetricsError(`Error fetching user following list: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new MetricsError("Failed to fetch user following list"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as IFetchUserFollowingResponse;
    },
    enabled: !!userId && canFetch,
  });

  useEffect(() => {
    if (data?.data) {
      const newFollowing = data.data;
      const { totalPages: newTotalPages } = data.meta;

      setTotalPages(newTotalPages || 0);
      setHasNextPage(currentPage < (newTotalPages || 0));

      if (currentPage === 1) {
        setAllFollowing(newFollowing || []);
      } else {
        setAllFollowing((prev) => {
          const existingIds = new Set(prev.map((f) => f.id));
          const uniqueNew = (newFollowing || []).filter(
            (f: IFollowingData) => !existingIds.has(f.id),
          );
          return [...prev, ...uniqueNew];
        });
      }
      if (newFollowing && newFollowing.length > 0) {
        addFollowings(newFollowing.map((f) => f.id));
      }
    }
  }, [data, currentPage, addFollowings]);

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
    setAllFollowing([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setIsLoadingMore(false);
    refetch();
  }, [refetch]);

  return {
    following: allFollowing,
    currentPage,
    hasNextPage,
    totalPages,

    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error: error?.message || null,

    loadMore,
    refresh,

    isEmpty: allFollowing.length === 0 && !isLoading,
    canLoadMore: hasNextPage && !isLoading && !isLoadingMore,
  };
};
