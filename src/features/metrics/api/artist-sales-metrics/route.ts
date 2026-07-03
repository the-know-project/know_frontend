import { ApiClient } from "@/src/lib/api-client";
import { METRICS_OP } from "../../data/metrics.route";
import { IFetchArtistSalesData } from "../../types/metrics.types";

export async function fetchArtistSalesMetrics(ctx: IFetchArtistSalesData) {
  const { duration = "MONTHLY" } = ctx;
  const path = `${METRICS_OP.SALES_METRICS}?duration=${duration}`;
  return await ApiClient.get(path);
}
