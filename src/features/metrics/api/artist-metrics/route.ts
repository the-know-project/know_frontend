import { ApiClient } from "@/src/lib/api-client";
import { METRICS_OP } from "@/src/features/metrics/data/metrics.route";

export async function fetchArtistMetrics() {
  return ApiClient.get(METRICS_OP.USER_METRICS);
}
