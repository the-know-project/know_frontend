import { ApiClient } from "@/src/lib/api-client";
import { IAddToCart } from "../../types/cart.types";
import { CART_OP } from "../../data/cart.route";

export async function addToCart(ctx: IAddToCart) {
  return await ApiClient.post(CART_OP.ADD_TO_CART, ctx);
}
