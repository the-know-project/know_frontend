import { useMutation, useQueryClient } from "@tanstack/react-query";
import { likeCollection, unlikeCollection } from "../api/collections.api";
import type {
  FetchCollectionResponse,
  ToggleCollectionLikeInput,
} from "../dto/collection.dto";
import { unwrapCollectionRequest } from "../utils/collection-result";

export function useToggleCollectionLike() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (input: ToggleCollectionLikeInput) =>
      unwrapCollectionRequest(
        input.isLiked
          ? unlikeCollection({ collectionId: input.collectionId })
          : likeCollection({ collectionId: input.collectionId }),
        input.isLiked ? "unlike collection" : "like collection",
      ),
    onSuccess: (_result, input) => {
      queryClient.setQueryData<FetchCollectionResponse>(
        ["collection", input.collectionId],
        (current) =>
          current
            ? {
                ...current,
                data: {
                  ...current.data,
                  isLikedByUser: !input.isLiked,
                  numOfLikes: Math.max(
                    0,
                    Number(current.data.numOfLikes ?? 0) +
                      (input.isLiked ? -1 : 1),
                  ),
                },
              }
            : current,
      );
    },
  });
}
