import { ApiClient } from "@/src/lib/api-client";
import { METRICS_OP } from "../../data/metrics.route";
import { IFetchUserFollowers } from "../../types/metrics.types";

export async function fetchUserFollowers(ctx: IFetchUserFollowers) {
  const url = `${METRICS_OP.USER_FOLLOWERS}?userId=${ctx.userId}&page=${ctx.page}&limit=${ctx.limit}`;
  return await ApiClient.get(url);
}
