import { useInfiniteQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import {
  fetchArtistContent,
  type ArtistContentType,
} from "../api/artist-content/route";

export function useArtistContent(
  artistId: string,
  type: ArtistContentType,
  enabled: boolean,
) {
  return useInfiniteQuery({
    queryKey: ["explore-artist-content", artistId, type],
    initialPageParam: 1,
    enabled: enabled && Boolean(artistId),
    queryFn: async ({ pageParam }) => {
      const result = await ResultAsync.fromPromise(
        fetchArtistContent(artistId, type, pageParam),
        (error) => (error instanceof Error ? error : new Error(String(error))),
      ).andThen((response) =>
        response.status === 200
          ? ok(response)
          : err(new Error("Failed to load artist content")),
      );
      if (result.isErr()) throw result.error;
      return result.value;
    },
    getNextPageParam: (lastPage) =>
      lastPage.data.pagination.hasNextPage
        ? lastPage.data.pagination.currentPage + 1
        : undefined,
  });
}
