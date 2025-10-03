import { useCallback, useEffect, useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchAllExploreAssets } from "../api/fetch-asset/route";
import { ExploreErrorMessages } from "../data/explore.data";
import { ExploreError } from "../errors/explore.error";
import { TFetchExploreAsset, TAsset } from "../types/explore.types";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

interface UseInfiniteExploreAssetsProps {
  categories?: string[];
  filters?: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  };
  limit?: number;
}

export const useInfiniteExploreAssets = ({
  categories = [],
  filters = {},
  limit = 12,
}: UseInfiniteExploreAssetsProps = {}) => {
  const userId = useTokenStore(selectUserId);
  const queryClient = useQueryClient();

  const [allAssets, setAllAssets] = useState<TAsset[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const queryParams: TFetchExploreAsset = useMemo(() => {
    const params: TFetchExploreAsset = {
      userId,
      page: currentPage,
      limit,
    };

    if (categories.length > 0) {
      params.categories = categories;
    }

    if (filters.priceMin !== undefined) params.priceMin = filters.priceMin;
    if (filters.priceMax !== undefined) params.priceMax = filters.priceMax;
    if (filters.sortBy !== undefined) params.sortBy = filters.sortBy;
    if (filters.available !== undefined) params.available = filters.available;

    console.log("🔍 Query Params:", params);
    console.log("📂 Categories:", categories);
    console.log("🎛️ Filters:", filters);

    return params;
  }, [userId, currentPage, limit, categories, filters]);

  // Create a filter signature to detect when filters change
  const filterSignature = useMemo(() => {
    const signature = JSON.stringify({
      categories: categories.length > 0 ? categories : undefined,
      ...filters,
    });
    console.log("🔑 Filter Signature:", signature);
    return signature;
  }, [categories, filters]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["fetch-explore-asset", queryParams],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchAllExploreAssets(queryParams),
        (error: any) => new ExploreError(`Explore error ${error}`),
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
  });

  // Reset everything when filters change
  useEffect(() => {
    console.log("🔄 Filter changed, resetting state");
    setAllAssets([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setIsLoadingMore(false);

    // Invalidate all related queries to force fresh data
    queryClient.invalidateQueries({
      queryKey: ["fetch-explore-asset"],
    });
  }, [filterSignature, queryClient]);

  useEffect(() => {
    if (data?.data) {
      const { assets: newAssets, totalPages: newTotalPages } = data.data;

      console.log("📊 API Response:", {
        assetsCount: newAssets?.length || 0,
        totalPages: newTotalPages,
        currentPage,
        assets: newAssets,
      });

      setTotalPages(newTotalPages || 0);
      setHasNextPage(currentPage < (newTotalPages || 0));

      if (currentPage === 1) {
        console.log("🔄 Setting new assets (page 1):", newAssets?.length || 0);
        setAllAssets(newAssets || []);
      } else {
        setAllAssets((prevAssets) => {
          const existingIds = new Set(prevAssets.map((asset) => asset.fileId));
          const uniqueNewAssets = (newAssets || []).filter(
            (asset: TAsset) => !existingIds.has(asset.fileId),
          );
          console.log("➕ Appending assets:", uniqueNewAssets.length);
          return [...prevAssets, ...uniqueNewAssets];
        });
      }
    } else {
      console.log("❌ No data received from API");
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

  const refetchAssets = useCallback(() => {
    setAllAssets([]);
    setCurrentPage(1);
    setHasNextPage(true);
  }, []);

  return {
    assets: allAssets,
    currentPage,
    hasNextPage,
    totalPages,

    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error: error?.message || null,

    loadMore,
    refetch: refetchAssets,

    isEmpty: allAssets.length === 0 && !isLoading,
    canLoadMore: hasNextPage && !isLoading && !isLoadingMore,
  };
};
