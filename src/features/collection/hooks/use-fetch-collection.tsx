import { err, ok, ResultAsync } from "neverthrow";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { useTokenStore } from "../../auth/state/store";
import { CollectionError } from "../error/collection.error";
import {
  FetchCollectionResponseDto,
  IFetchCollection,
} from "../types/collections.type";
import { fetchCollection } from "../api/fetch-collection/route";
import { useQuery } from "@tanstack/react-query";

type fetchCollectionParams = Omit<IFetchCollection, "userId">;
export const useFetchCollection = (param: fetchCollectionParams) => {
  const userId = useTokenStore(selectUserId);
  return useQuery({
    queryKey: [`fetch-collection-${userId}`],
    queryFn: async () => {
      if (!userId) {
        throw new CollectionError("Not authorized, please login");
      }

      const result = await ResultAsync.fromPromise(
        fetchCollection({
          userId,
          collectionId: param.collectionId,
        }),
        (error) =>
          new CollectionError(`Error fetching collection`, {
            cause: error,
          }),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new CollectionError(`Error fetching collection`, {
              cause: data.message,
            }),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as FetchCollectionResponseDto;
    },
    enabled: !!userId,
    retry: 2,
  });
};
