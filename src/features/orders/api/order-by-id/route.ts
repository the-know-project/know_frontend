import { ApiClient } from "@/src/lib/api-client";
import { ORDERS_OP } from "../../data/orders.data";

export async function fetchOrderById(orderId: string) {
  const url = `${ORDERS_OP.ORDER_BY_ID}?orderId=${orderId}`;
  return await ApiClient.get(url);
}
