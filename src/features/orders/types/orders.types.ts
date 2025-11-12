import { z } from "zod";
import { CreateOrderDto } from "../dto/orders.dto";

export type ICreateOrder = z.infer<typeof CreateOrderDto>;
