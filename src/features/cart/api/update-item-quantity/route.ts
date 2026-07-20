import { ApiClient } from "@/src/lib/api-client";
import { IUpdateCartItemQuantity } from "../../types/cart.types";
import { CART_OP } from "../../data/cart.route";

export async function updateItemQuantity(ctx: IUpdateCartItemQuantity) {
  return ApiClient.post(CART_OP.UPDATE_ITEM_QUANTITY, ctx);
}
