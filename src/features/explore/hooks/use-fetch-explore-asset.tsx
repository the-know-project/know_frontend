import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchAllExploreAssets } from "../api/fetch-asset/route";
import { ExploreErrorMessages } from "../data/explore.data";
import { FetchExploreAssetDto } from "../dto/explore.dto";
import { ExploreError } from "../errors/explore.error";
import { TFetchExploreAsset } from "../types/explore.types";

export const useFetchExploreAsset = (params: TFetchExploreAsset) => {
  return useQuery({
    queryKey: [`fetch-explore-asset`, params],
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
