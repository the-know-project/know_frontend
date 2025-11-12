import { ApiClient } from "@/src/lib/api-client";
import { ORDERS_OP } from "../../data/orders.data";
import { IFetchUserOrders } from "../../types/orders.types";

export async function fetchUserOrders(ctx: IFetchUserOrders) {
  const url = `${ORDERS_OP.USER_ORDERS}?userId=${ctx.userId}&page=${ctx.page}&limit=${ctx.limit}&status=${ctx.status}`;
  return await ApiClient.get(url);
}
