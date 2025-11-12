import { z } from "zod";
import {
  FetchUserOrdersDto,
  CreateOrderDto,
  FetchUserOrders,
  OrderStatus,
  OrdersSummaryDto,
  OrdersByIdDto,
} from "../dto/orders.dto";

export type ICreateOrder = z.infer<typeof CreateOrderDto>;
export type IFetchUserOrders = z.infer<typeof FetchUserOrders>;
export type TOrderStatus = z.infer<typeof OrderStatus>;
export type UserOrdersResponse = z.infer<typeof FetchUserOrdersDto>;
export type OrderSummaryResponse = z.infer<typeof OrdersSummaryDto>;
export type OrdersByIdResponse = z.infer<typeof OrdersByIdDto>;
