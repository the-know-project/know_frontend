import { useMutation, useQueryClient } from "@tanstack/react-query";
import { removeAssetFromCollection } from "../api/collections.api";
import type { CollectionAssetInput } from "../dto/collection.dto";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useRemoveAssetFromCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CollectionAssetInput) =>
      unwrapCollectionRequest(
        removeAssetFromCollection(input),
        "remove asset from collection",
      ),
    onSuccess: (_result, input) =>
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: ["collection", input.collectionId],
        }),
        queryClient.invalidateQueries({ queryKey: ["artist-collections"] }),
        queryClient.invalidateQueries({ queryKey: ["explore-artist-content"] }),
      ]),
  });
}
