import { ApiClient } from "@/src/lib/api-client";
import { CART_OP } from "../../data/cart.route";

export async function fetchUserCart(userId: string) {
  const path = `${CART_OP.FETCH_USER_CART}?userId=${userId}`;
  return await ApiClient.get(path);
}
