import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchSemanticSearch } from "../api/semantic-search/route";
import {
  SemanticSearchFilters,
  SemanticSearchResponse,
} from "../types/semantic-search.types";
import { ExploreError } from "../errors/explore.error";

export function useSemanticSearch(
  query: string,
  filters: SemanticSearchFilters = {},
) {
  const normalizedQuery = query.trim();
  return useQuery({
    queryKey: ["semantic-search", normalizedQuery, filters],
    enabled: normalizedQuery.length > 0,
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchSemanticSearch(normalizedQuery, filters),
        (error) => new ExploreError(`Semantic search failed: ${String(error)}`),
      ).andThen((response) =>
        response.status === 200
          ? ok(response)
          : err(new ExploreError("Semantic search returned an error")),
      );
      if (result.isErr()) throw result.error;
      return result.value as SemanticSearchResponse;
    },
    staleTime: 30_000,
  });
}
