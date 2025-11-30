import { ApiClient } from "@/src/lib/api-client";
import { METRICS_OP } from "../../data/metrics.route";
import { IValidateUserFollowing } from "../../types/metrics.types";

export async function validateUserFollowing(ctx: IValidateUserFollowing) {
  const url = `${METRICS_OP.VALIDATE_FOLLOW}?followerId=${ctx.followerId}&followingId=${ctx.followingId}`;
  return ApiClient.get(url);
}
