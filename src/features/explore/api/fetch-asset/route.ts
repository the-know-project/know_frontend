import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { TFetchExploreAsset } from "../../types/explore.types";

export async function fetchAllExploreAssets(ctx: TFetchExploreAsset) {
  let path = `${EXPLORE_OP.ALL_ASSET}`;
  const queryParams = new URLSearchParams();

  Object.keys(ctx).forEach((key) => {
    const value = ctx[key as keyof TFetchExploreAsset];

    if (value !== undefined && value !== null) {
      if (key === "categories" && Array.isArray(value)) {
        value.forEach((category) => {
          queryParams.append("categories", category);
        });
      } else {
        queryParams.append(key, String(value));
      }
    }
  });

  if (queryParams.toString()) {
    path += `?${queryParams.toString()}`;
  }

  return await ApiClient.get(path);
}
