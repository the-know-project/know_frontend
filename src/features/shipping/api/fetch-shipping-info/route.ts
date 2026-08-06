import { ApiClient } from "@/src/lib/api-client";
import { SHIPPING_ROUTES } from "../../data/shipping.data";

export async function fetchShippingInfo() {
  return await ApiClient.get(SHIPPING_ROUTES.FETCH_SHIPPING_INFO);
}
