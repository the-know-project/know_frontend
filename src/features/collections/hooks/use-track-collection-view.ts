import { useMutation, useQueryClient } from "@tanstack/react-query";
import { trackCollectionView } from "../api/collections.api";
import type {
  CollectionMetricInput,
  FetchCollectionResponse,
} from "../dto/collection.dto";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useTrackCollectionView() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: CollectionMetricInput) =>
      unwrapCollectionRequest(
        trackCollectionView(input),
        "track collection view",
      ),
    onSuccess: (result, input) => {
      if (!result.data?.counted) return;
      queryClient.setQueryData<FetchCollectionResponse>(
        ["collection", input.collectionId],
        (current) =>
          current
            ? {
                ...current,
                data: {
                  ...current.data,
                  numOfViews: Number(current.data.numOfViews ?? 0) + 1,
                },
              }
            : current,
      );
    },
  });
}
