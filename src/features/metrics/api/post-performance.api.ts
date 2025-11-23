import { ApiClient } from "@/src/lib/api-client";
import { GetPostPerformanceParams, PostPerformanceResponse } from "@/src/features/profile/artist/dto/post-performance.dto";
import { METRICS_OP } from "../data/metrics.route";

export async function getPostPerformance(
  ctx: GetPostPerformanceParams
): Promise<PostPerformanceResponse> {
  const path = `${METRICS_OP.POST_PERFORMANCE}?userId=${ctx.userId}&page=${ctx.page || 1}&limit=${ctx.limit || 10}`;
  return ApiClient.get(path);
}