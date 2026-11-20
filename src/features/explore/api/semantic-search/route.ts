import { ApiClient } from "@/src/lib/api-client";
import {
  SemanticSearchFilters,
  SemanticSearchResponse,
} from "../../types/semantic-search.types";

export async function fetchSemanticSearch(
  query: string,
  filters: SemanticSearchFilters = {},
) {
  const params = new URLSearchParams({ q: query });

  filters.categories?.forEach((category) =>
    params.append("categories", category),
  );
  if (filters.priceMin !== undefined)
    params.set("priceMin", String(filters.priceMin));
  if (filters.priceMax !== undefined)
    params.set("priceMax", String(filters.priceMax));
  if (filters.available !== undefined)
    params.set("available", String(filters.available));

  return ApiClient.get<SemanticSearchResponse>(
    `/api/asset/semanticSearch?${params.toString()}`,
  );
}
