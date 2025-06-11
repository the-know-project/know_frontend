import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { TFetchExploreAsset } from "../types/explore.types";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchAllExploreAssets } from "../api/fetch-asset/route";
import { ExploreError } from "../errors/explore.error";
import { FetchExploreAssetDto } from "../dto/explore.dto";
import { ExploreErrorMessages } from "../data/explore.data";

export const useFetchExploreAsset = (params: TFetchExploreAsset) => {
  const id = useTokenStore((state) => state.user?.id);
  return useQuery({
    queryKey: [`fetch-explore-${id}-asset`, params],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchAllExploreAssets(params),
        (error) => new ExploreError(`Explore error ${error}`),
      ).andThen((data) => {
        const parsedResult = FetchExploreAssetDto.safeParse(data);

        if (parsedResult.success) {
          return ok(parsedResult.data);
        } else {
          return err(
            new ExploreError(ExploreErrorMessages.FAILED_TO_FETCH_ASSET),
          );
        }
      });
      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
  });
};
