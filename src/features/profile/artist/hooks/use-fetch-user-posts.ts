import { useCallback, useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchUserPosts as fetchUserPostsApi } from "../api/posts/route";
import { ArtistError } from "../error/artist.error";
import { TUserAssetData } from "../dto/artist.dto";
import { IFetchUserAsset } from "../../types/profile.types";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";

interface UseSimpleInfiniteUserPostsProps {
  userId?: string;
  limit?: number;
}

interface PostsApiResponse {
  status: number;
  data: {
    assets: TUserAssetData[];
    pagination: {
      totalPages: number;
      totalItems: number;
      hasNextPage: boolean;
      currentPage: number;
    };
  };
}

export const useSimpleInfiniteUserPosts = ({
  userId,
  limit = 12,
}: UseSimpleInfiniteUserPostsProps = {}) => {
  const currentUserId = useTokenStore(selectUserId);
  const targetUserId = userId || currentUserId;

  const [allPosts, setAllPosts] = useState<TUserAssetData[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalItems, setTotalItems] = useState(0);

  const queryParams: IFetchUserAsset = {
    userId: targetUserId!,
    page: currentPage,
    limit,
  };

  const { data, isLoading, error } = useQuery({
    queryKey: [`user-${targetUserId}-posts`, queryParams],
    queryFn: async (): Promise<PostsApiResponse> => {
      if (!targetUserId) {
        throw new ArtistError("User ID is required");
      }

      const result = await ResultAsync.fromPromise(
        fetchUserPostsApi(queryParams),
        (error) => new ArtistError(`Error fetching user posts: ${error}`),
      ).andThen((data: any) => {
        if (data.status === 200) {
          return ok(data as PostsApiResponse);
        } else {
          return err(new ArtistError("Failed to fetch user posts"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    staleTime: 5000,
    enabled: !!targetUserId,
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
      const { assets: newPosts, pagination } = data.data;

      setTotalPages(pagination?.totalPages || 0);
      setTotalItems(pagination?.totalItems || 0);
      setHasNextPage(pagination?.hasNextPage || false);

      if (currentPage === 1) {
        setAllPosts(newPosts || []);
      } else {
        setAllPosts((prevPosts) => {
          const existingIds = new Set(prevPosts.map((post) => post.fileId));
          const uniqueNewPosts = (newPosts || []).filter(
            (post: TUserAssetData) => !existingIds.has(post.fileId),
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

// Legacy hook for backward compatibility
export const useFetchUserPosts = () => {
  const userId = useTokenStore(selectUserId);

  if (!userId) {
    return {
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }

  return useQuery({
    queryKey: [`user-${userId}-posts`],
    queryFn: async (): Promise<PostsApiResponse> => {
      const result = await ResultAsync.fromPromise(
        fetchUserPostsApi({ userId, page: 1, limit: 12 }),
        (error) => new ArtistError(`Error fetching user posts ${error}`),
      );

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as PostsApiResponse;
    },
  });
};
