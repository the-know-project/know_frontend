import { ApiClient } from "@/src/lib/api-client";
import { ICreateShippingInfo } from "../../types/shipping.types";
import { SHIPPING_ROUTES } from "../../data/shipping.data";

export async function createShippingInfo(ctx: ICreateShippingInfo) {
  return await ApiClient.post(SHIPPING_ROUTES.CREATE_SHIPPING_INFO, ctx);
}
