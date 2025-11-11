import { ApiClient } from "@/src/lib/api-client";

export interface IOrder {
  id: string;
  title: string;
  artist: string;
  views: number;
  imageUrl: string;
  status: string;
  // Add other fields your API returns
}

export interface IOrdersResponse {
  orders?: IOrder[];
  data?: IOrder[];
  total?: number;
  // Add other fields based on your API response
}

export interface IOrderSummary {
  totalOrders: number;
  totalSpent: number;
  // Add other fields based on your API response
}

export const buyerOrdersService = {
  fetchUserOrders: async (status?: string): Promise<IOrdersResponse> => {
    return await ApiClient.get("/api/orders/fetchUserOrders", {
      params: status ? { status } : {},
    });
  },

  fetchOrderSummary: async (): Promise<IOrderSummary> => {
    return await ApiClient.get("/api/orders/fetchUserOrderSummary");
  },

  fetchOrderById: async (orderId: string): Promise<IOrder> => {
    return await ApiClient.get("/api/orders/fetchOrderbyId", {
      params: { orderId },
    });
  },

  createOrder: async (orderData: any): Promise<any> => {
    return await ApiClient.post("/api/orders/create", orderData);
  },
};
