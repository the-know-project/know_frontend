import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCollection } from "../api/collections.api";
import type { DeleteCollectionInput } from "../dto/collection.dto";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useDeleteCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: DeleteCollectionInput) =>
      unwrapCollectionRequest(deleteCollection(input), "delete collection"),
    onSuccess: (_result, input) =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["collection", input.collectionId] }),
        queryClient.invalidateQueries({ queryKey: ["artist-collections"] }),
        queryClient.invalidateQueries({ queryKey: ["explore-artist-content"] }),
      ]),
  });
}
