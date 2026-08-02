import { ApiClient } from "@/src/lib/api-client";
import { IListAsset } from "../../types/asset.types";
import { PROFILE_OP } from "../../../data/profile.route";

export function listAsset(ctx: IListAsset) {
  return ApiClient.post(PROFILE_OP.LIST_ASSET, ctx);
}
