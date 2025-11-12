import { ApiClient } from "@/src/lib/api-client";
import { ICreateOrder } from "../../types/orders.types";
import { ORDERS_OP } from "../../data/orders.data";

export async function createOrder(ctx: ICreateOrder) {
  return await ApiClient.post(ORDERS_OP.CREATE, ctx);
}
