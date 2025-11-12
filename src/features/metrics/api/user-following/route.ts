import { ApiClient } from "@/src/lib/api-client";
import { METRICS_OP } from "../../data/metrics.route";
import { IFetchUserFollowing } from "../../types/metrics.types";

export async function fetchUserFollowing(ctx: IFetchUserFollowing) {
  const url = `${METRICS_OP.USER_FOLLOWING}?userId=${ctx.userId}&page=${ctx.page}&limit=${ctx.limit}`;
  return await ApiClient.get(url);
}
