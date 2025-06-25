import { z } from "zod";
import { CartData } from "../dto/cart.dto";

export type TCart = z.infer<typeof CartData>;
