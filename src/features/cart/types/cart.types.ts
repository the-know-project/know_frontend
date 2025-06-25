import { z } from "zod";
import { CartData } from "../dto/cart.dto";
import { AddToCartSchema } from "../schema/cart.schema";

export type TCart = z.infer<typeof CartData>;
export type IAddToCart = z.infer<typeof AddToCartSchema>;
