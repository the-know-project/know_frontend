import { ApiClient } from "@/src/lib/api-client";
import { CART_OP } from "../../data/cart.route";

export async function clearCart() {
  return ApiClient.delete(CART_OP.CLEAR_CART);
}
