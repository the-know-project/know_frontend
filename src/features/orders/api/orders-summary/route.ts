import { ApiClient } from "@/src/lib/api-client";
import { ORDERS_OP } from "../../data/orders.data";

export async function fetchOrdersSummary(userId: string) {
  const url = `${ORDERS_OP.ORDERS_SUMMARY}?userId=${userId}`;
  return ApiClient.get(url);
}
