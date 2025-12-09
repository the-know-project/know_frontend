import { ApiClient } from "@/src/lib/api-client";
import { IFollowUser } from "../../types/metrics.types";
import { METRICS_OP } from "../../data/metrics.route";

export async function followUser(ctx: IFollowUser) {
  return await ApiClient.post(METRICS_OP.FOLLOW_USER, {
    userId: ctx.followerId,
    followingId: ctx.followingId,
  });
}
