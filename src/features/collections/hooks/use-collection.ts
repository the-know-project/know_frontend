import { useQuery } from "@tanstack/react-query";
import { fetchCollection } from "../api/collections.api";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useCollection(collectionId: string) {
  return useQuery({
    queryKey: ["collection", collectionId],
    queryFn: () =>
      unwrapCollectionRequest(
        fetchCollection(collectionId),
        "fetch collection",
      ),
    enabled: Boolean(collectionId),
  });
}
