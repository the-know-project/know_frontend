import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";

import { ArtistError } from "../error/artist.error";
import {
  FetchAllCollectionsResponseDto,
  IFetchAllCollections,
  TCollectionData,
} from "../types/collections.types";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { fetchAllCollections } from "../api/collections/fetch-all-collections/route";

interface UseSimpleInfiniteArtistCollectionsProps {
  userId?: string;
  limit?: number;
}

export const useSimpleInfiniteArtistCollections = ({
  userId,
  limit = 12,
}: UseSimpleInfiniteArtistCollectionsProps = {}) => {
  const currentUserId = useTokenStore(selectUserId);
  const targetUserId = userId || currentUserId;

  const [allCollections, setAllCollections] = useState<TCollectionData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const queryParams: IFetchAllCollections = {
    userId: targetUserId!,
    page: currentPage,
    limit,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`user-${targetUserId}-collections`, queryParams],
    queryFn: async (): Promise<FetchAllCollectionsResponseDto> => {
      if (!targetUserId) {
        throw new ArtistError("User ID is required");
      }

      const result = await ResultAsync.fromPromise(
        fetchAllCollections(queryParams),
        (error) =>
          new ArtistError(`Error fetching artist collections: ${error}`),
      ).andThen((data: any) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new ArtistError("Failed to fetch artist collections"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as FetchAllCollectionsResponseDto;
    },
    staleTime: 5000,
    enabled: !!targetUserId,
  });

  useEffect(() => {
    setAllCollections([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setTotalItems(0);
    setIsLoadingMore(false);
  }, [targetUserId]);

  useEffect(() => {
    if (data?.data) {
      const { data: newCollections, meta: pagination } = data;

      setTotalPages(pagination?.totalPages || 0);
      setTotalItems(pagination?.totalItems || 0);
      setHasNextPage(pagination?.hasNextPage || false);

      if (currentPage === 1) {
        setAllCollections(newCollections || []);
      } else {
        setAllCollections((prevCollections) => {
          const existingIds = new Set(
            prevCollections.map((collection) => collection.id),
          );
          const uniqueNewCollections = (newCollections || []).filter(
            (collection: TCollectionData) => !existingIds.has(collection.id),
          );
          return [...prevCollections, ...uniqueNewCollections];
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
    setAllCollections([]);
    setCurrentPage(1);
    setHasNextPage(true);
    setTotalPages(0);
    setTotalItems(0);
    setIsLoadingMore(false);
  }, []);

  return {
    collections: allCollections,
    currentPage,
    hasNextPage,
    totalPages,
    totalItems,

    isLoading: isLoading && currentPage === 1,
    isLoadingMore,
    error: error?.message || null,

    loadMore,
    refresh,

    isEmpty: allCollections.length === 0 && !isLoading,
    canLoadMore: hasNextPage && !isLoading && !isLoadingMore,
  };
};
