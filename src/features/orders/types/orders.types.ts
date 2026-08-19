import { z } from "zod";
import {
  FetchUserOrdersDto,
  CreateOrderDto,
  FetchUserOrders,
  OrderStatus,
  OrdersData,
  OrdersSummaryDto,
  OrdersByIdDto,
  OrderItems,
  CreateOrderResponseDto,
} from "../dto/orders.dto";

export type ICreateOrder = z.infer<typeof CreateOrderDto>;
export type IFetchUserOrders = z.infer<typeof FetchUserOrders>;
export type TOrderStatus = z.infer<typeof OrderStatus>;
export type TOrdersData = z.infer<typeof OrdersData>;
export type UserOrdersResponse = z.infer<typeof FetchUserOrdersDto>;
export type OrderSummaryResponse = z.infer<typeof OrdersSummaryDto>;
export type OrdersByIdResponse = z.infer<typeof OrdersByIdDto>;

export type IOrderItems = z.infer<typeof OrderItems>;

export type ICreateOrderResponse = z.infer<typeof CreateOrderResponseDto>;
