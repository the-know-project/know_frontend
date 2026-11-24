import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCollection } from "../api/collections.api";
import type { UpdateCollectionInput } from "../dto/collection.dto";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useUpdateCollection() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateCollectionInput) =>
      unwrapCollectionRequest(updateCollection(input), "update collection"),
    onSuccess: (_result, input) =>
      queryClient.invalidateQueries({
        queryKey: ["collection", input.collectionId],
      }),
  });
}
