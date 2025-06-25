import { ApiClient } from "@/src/lib/api-client";
import { IAddToCart } from "../../types/cart.types";
import { CART_OP } from "../../data/cart.route";

export async function removeFromCart(ctx: IAddToCart) {
  return await ApiClient.post(CART_OP.REMOVE_FROM_CART, ctx);
}
