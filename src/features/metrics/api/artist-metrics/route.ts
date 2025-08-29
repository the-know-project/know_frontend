import { ApiClient } from "@/src/lib/api-client";
import { METRICS_OP } from "@/src/features/metrics/data/metrics.route";

export async function fetchArtistMetrics(userId: string) {
  const path = `${METRICS_OP.USER_METRICS}?userId=${userId}`;
  return ApiClient.get(path);
}
