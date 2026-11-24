import { useInfiniteQuery } from "@tanstack/react-query";
import { fetchArtistCollections } from "../api/collections.api";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useArtistCollections(
  artistId: string,
  enabled = true,
  limit = 12,
) {
  return useInfiniteQuery({
    queryKey: ["artist-collections", artistId],
    initialPageParam: 1,
    enabled: enabled && Boolean(artistId),
    queryFn: ({ pageParam }) =>
      unwrapCollectionRequest(
        fetchArtistCollections(artistId, pageParam, limit),
        "fetch artist collections",
      ),
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.hasNextPage
        ? lastPage.data.pagination.currentPage + 1
        : undefined,
  });
}
