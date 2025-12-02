import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { TFetchComments } from "../../types/explore.types";

export async function fetchPostComments(ctx: TFetchComments) {
  let path = `${EXPLORE_OP.FETCH_POST_COMMENTS}`;
  const queryParams = new URLSearchParams();

  Object.keys(ctx).forEach((key) => {
    const value = ctx[key as keyof TFetchComments];
    if (value !== undefined && value !== null) {
      queryParams.append(key, String(value));
    }
  });

  if (queryParams.toString()) {
    path += `?${queryParams.toString()}`;
  }

  return await ApiClient.get(path);
}