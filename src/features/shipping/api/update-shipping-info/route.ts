import { ApiClient } from "@/src/lib/api-client";
import { ICreateShippingInfo } from "../../types/shipping.types";
import { SHIPPING_ROUTES } from "../../data/shipping.data";

export async function updateShippingInformation(
  ctx: Partial<ICreateShippingInfo>,
) {
  return ApiClient.put(SHIPPING_ROUTES.UPDATE_SHIPPING_INFO, ctx);
}
