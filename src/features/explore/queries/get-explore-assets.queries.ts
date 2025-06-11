import { handleAxiosError } from "@/src/utils/handle-axios-error";
import { fetchAllExploreAssets } from "../api/fetch-asset/route";
import { TFetchExploreAsset } from "../types/explore.types";

export const getExploreAssetsQuery = async (
  params: TFetchExploreAsset = {},
) => {
  try {
    const result = await fetchAllExploreAssets(params);
    if (!result) throw new Error("No data found");

    return result;
  } catch (error) {
    handleAxiosError(error);
    throw new Error(
      error instanceof Error ? error.message : "An unexpected error occurred",
    );
  }
};

export const getExploreAssetsQueryOptions = (
  params: TFetchExploreAsset = {},
) => ({
  queryKey: ["fetch-explore-asset", params],
  queryFn: () => getExploreAssetsQuery(params),
});
