import { ApiClient } from "@/src/lib/api-client";
import { TLikeAsset } from "../../types/explore.types";
import { EXPLORE_OP } from "../../data/explore.route";

export async function unLikeAsset(ctx: TLikeAsset) {
  return await ApiClient.post(EXPLORE_OP.UNLIKE_ASSET, ctx);
}
