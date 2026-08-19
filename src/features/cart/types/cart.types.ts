import { z } from "zod";
import {
  BaseResponseDto,
  CartData,
  CartResponseDto,
  IAddToLocalCartSchema,
  UpdateCartItemQuantitySchema,
} from "../dto/cart.dto";
import { AddToCartSchema } from "../schema/cart.schema";

export type TCart = z.infer<typeof CartData>;
export type IAddToCart = z.infer<typeof AddToCartSchema>;
export type IUserCart = z.infer<typeof CartResponseDto>;
export type IAddToLocalCart = z.infer<typeof IAddToLocalCartSchema>;

export type IUpdateCartItemQuantity = z.infer<
  typeof UpdateCartItemQuantitySchema
>;

export type IBaseResponse = z.infer<typeof BaseResponseDto>;
