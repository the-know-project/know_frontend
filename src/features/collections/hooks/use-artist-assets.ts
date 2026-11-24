import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArtistAssets } from "../api/collections.api";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useArtistAssets(artistId: string, enabled = true, limit = 12) {
  return useInfiniteQuery({
    queryKey: ["artist-collection-assets", artistId],
    initialPageParam: 1,
    enabled: enabled && Boolean(artistId),
    queryFn: ({ pageParam }) =>
      unwrapCollectionRequest(
        fetchArtistAssets(artistId, pageParam, limit),
        "fetch artist assets",
      ),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.hasNextPage
        ? lastPage.data.pagination.currentPage + 1
        : undefined,
  });
}
