import { useMutation } from "@tanstack/react-query";
import { createCollection } from "../api/collections.api";
import type { CreateCollectionInput } from "../dto/collection.dto";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useCreateCollection() {
  return useMutation({
    mutationFn: (input: CreateCollectionInput) =>
      unwrapCollectionRequest(
        createCollection(input),
        "create collection",
        [200, 201],
      ),
  });
}
