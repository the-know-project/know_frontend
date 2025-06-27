import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchAllExploreAssets } from "../api/fetch-asset/route";
import { ExploreErrorMessages } from "../data/explore.data";
import { ExploreError } from "../errors/explore.error";
import { TFetchExploreAsset, TAsset } from "../types/explore.types";
import { useTokenStore } from "../../auth/state/store";
import { useSafeAuthStatus } from "../../auth/hooks/use-safe-auth-status";

interface UseSimpleInfiniteAssetsProps {
  categories?: string[];
  filters?: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  };
  limit?: number;
}

export const useSimpleInfiniteAssets = ({
  categories = [],
  filters = {},
  limit = 12,
}: UseSimpleInfiniteAssetsProps = {}) => {
  const userId = useTokenStore((state) => state.user?.id);
  const {
    role,
    isAuthenticated,
    error: authError,
  } = useSafeAuthStatus({
    redirectOnExpiry: true,
    redirectTo: "/login",
  });
  const [allAssets, setAllAssets] = useState<TAsset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const queryParams: TFetchExploreAsset = {
    userId,
    page: currentPage,
    limit,
    categories: categories.length > 0 ? categories : undefined,
    ...filters,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`fetch-explore-asset`, queryParams],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchAllExploreAssets(queryParams),
        (error) => new ExploreError(`Explore error ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(ExploreErrorMessages.FAILED_TO_FETCH_ASSET),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    staleTime: 5000,
    enabled: isAuthenticated && !authError, // Only run query if authenticated
  });

  useEffect(() => {
    setAllAssets([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setIsLoadingMore(false);
  }, [JSON.stringify(categories), JSON.stringify(filters)]);

  useEffect(() => {
    if (data?.data) {
      const { assets: newAssets, totalPages: newTotalPages } = data.data;

      setTotalPages(newTotalPages || 0);
      setHasNextPage(currentPage < (newTotalPages || 0));

      if (currentPage === 1) {
        setAllAssets(newAssets || []);
      } else {
        setAllAssets((prevAssets) => {
          const existingIds = new Set(prevAssets.map((asset) => asset.fileId));
          const uniqueNewAssets = (newAssets || []).filter(
            (asset: TAsset) => !existingIds.has(asset.fileId),
          );
          return [...prevAssets, ...uniqueNewAssets];
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
    setAllAssets([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setIsLoadingMore(false);
  }, []);

  return {
    assets: allAssets,
    currentPage,
    hasNextPage,
    totalPages,
    role,

    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error: error?.message || authError || null,

    loadMore,
    refresh,

    isEmpty: allAssets.length === 0 && !isLoading,
    canLoadMore: hasNextPage && !isLoading && !isLoadingMore,
  };
};
