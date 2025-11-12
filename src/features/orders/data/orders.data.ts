export enum ORDERS_OP {
  CREATE = "/api/orders/create",
  ORDER_BY_ID = "/api/orders/fetchOrderById",
  USER_ORDERS = "/api/orders/fetchUserOrders",
  ORDERS_SUMMARY = "/api/orders/fetchUserOrderSummary",
}

export const OrdersErrorMessages = {
  FAILED_TO_CREATE_ORDER: "Failed to create order",
  FAILED_TO_FETCH_USER_ORDERS: "Failed to fetch user orders",
  FAILED_TO_FETCH_ORDER_BY_ID: "Failed to fetch order by id",
  FAILED_TO_FETCH_ORDERS_SUMMARY: "Failed to fetch orders summary",
};
