import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useCallback, useEffect } from "react";
import { useTokenStore } from "../../auth/state/store";
import { fetchAllExploreAssets } from "../api/fetch-asset/route";
import { ExploreErrorMessages } from "../data/explore.data";
import { ExploreError } from "../errors/explore.error";
import { useInfiniteExploreStore } from "../state/infinite-explore.store";
import { TFetchExploreAsset } from "../types/explore.types";

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
  const userId = useTokenStore((state) => state.user?.id);

  const {
    assets,
    currentPage,
    hasNextPage,
    isLoading,
    isLoadingMore,
    error,
    setAssets,
    appendAssets,
    setCurrentPage,
    incrementPage,
    setHasNextPage,
    setTotalPages,
    setIsLoading,
    setIsLoadingMore,
    setError,
    setFilters,
    resetPagination,
  } = useInfiniteExploreStore();

  // Create the query parameters
  const queryParams: TFetchExploreAsset = {
    userId,
    page: currentPage,
    limit,
    categories: categories.length > 0 ? categories : undefined,
    ...filters,
  };

  // Main query for fetching assets
  const { data, refetch, isFetching } = useQuery({
    queryKey: ["infinite-explore-assets", queryParams],
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
    staleTime: 30000,
    enabled: false,
  });

  // Load initial data or append data based on page
  const loadAssets = useCallback(
    async (isLoadMore = false) => {
      try {
        if (isLoadMore) {
          setIsLoadingMore(true);
        } else {
          setIsLoading(true);
        }

        setError(null);

        const result = await refetch();

        if (result.data?.data) {
          const {
            assets: newAssets,
            totalPages,
            currentPage: responsePage,
          } = result.data.data;

          if (isLoadMore) {
            appendAssets(newAssets || []);
          } else {
            setAssets(newAssets || []);
          }

          setTotalPages(totalPages || 0);
          setHasNextPage((responsePage || currentPage) < (totalPages || 0));
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Failed to load assets";
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [
      refetch,
      currentPage,
      setIsLoading,
      setIsLoadingMore,
      setError,
      setAssets,
      appendAssets,
      setTotalPages,
      setHasNextPage,
    ],
  );

  const loadMore = useCallback(async () => {
    if (!hasNextPage || isLoading || isLoadingMore) {
      return;
    }

    incrementPage();
  }, [hasNextPage, isLoading, isLoadingMore, incrementPage]);

  const reloadWithFilters = useCallback(
    (newFilters: typeof filters, newCategories: string[] = []) => {
      setFilters({
        categories: newCategories.length > 0 ? newCategories : undefined,
        ...newFilters,
      });
      resetPagination();
      setCurrentPage(1);
    },
    [setFilters, resetPagination, setCurrentPage],
  );

  // Effect to load data when page changes
  useEffect(() => {
    if (currentPage === 1) {
      loadAssets(false);
    } else {
      loadAssets(true);
    }
  }, [currentPage]);

  useEffect(() => {
    const currentFilters = {
      categories: categories.length > 0 ? categories : undefined,
      ...filters,
    };

    setFilters(currentFilters);
  }, [categories, filters, setFilters]);

  useEffect(() => {
    if (currentPage === 1 && assets.length === 0 && !isLoading) {
      loadAssets(false);
    }
  }, []);

  return {
    assets,
    currentPage,
    hasNextPage,
    totalPages: useInfiniteExploreStore((state) => state.totalPages),

    isLoading,
    isLoadingMore,
    isFetching,
    error,

    loadMore,
    reloadWithFilters,
    refetch: () => loadAssets(false),

    isEmpty: assets.length === 0 && !isLoading,
    canLoadMore: hasNextPage && !isLoading && !isLoadingMore,
  };
};
