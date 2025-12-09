import { ApiClient } from "@/src/lib/api-client";
import { IUnFollowUser } from "../../types/metrics.types";
import { METRICS_OP } from "../../data/metrics.route";

export async function unfollowUser(ctx: IUnFollowUser) {
  return await ApiClient.post(METRICS_OP.UNFOLLOW_USER, {
    userId: ctx.followerId,
    followingId: ctx.followingId,
  });
}
