import { ApiClient } from "@/src/lib/api-client";
import { IIncrementViewCount } from "../types/metrics.types";
import { METRICS_OP } from "../data/metrics.route";

export async function incrementViewCount(ctx: IIncrementViewCount) {
  return await ApiClient.post(METRICS_OP.INCREMENT_VIEW_COUNT, ctx);
}
