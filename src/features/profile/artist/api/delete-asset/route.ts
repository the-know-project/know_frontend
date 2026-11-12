import { ApiClient } from "@/src/lib/api-client";
import { IDeleteAsset } from "../../types/asset.types";
import { PROFILE_OP } from "../../../data/profile.route";

export function deleteAsset(ctx: IDeleteAsset) {
  return ApiClient.delete(PROFILE_OP.DELETE_ASSET, ctx);
}
