import { z } from "zod";
import { CartData, CartResponseDto } from "../dto/cart.dto";
import { AddToCartSchema } from "../schema/cart.schema";

export type TCart = z.infer<typeof CartData>;
export type IAddToCart = z.infer<typeof AddToCartSchema>;
export type IUserCart = z.infer<typeof CartResponseDto>;
