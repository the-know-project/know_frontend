import { ApiClient } from "@/src/lib/api-client";
import { PROFILE_OP } from "../../../data/profile.route";
import { IFetchUserAsset } from "../../../types/profile.types";

export async function fetchUserPosts(ctx: IFetchUserAsset) {
  let path = `${PROFILE_OP.USER_ASSETS}?userId=${ctx.userId}&page=${ctx.page || 1}&limit=${ctx.limit || 12}`;

  return ApiClient.get(path);
}
