"use client";

import { useQuery } from "@tanstack/react-query";

export interface Order {
  id: string;
  title: string;
  artist: string;
  views: number;
  likes?: number;
  imageUrl: string;
}

type OrderType = "cart" | "pending" | "completed";

export const useFetchBuyerOrders = (orderType: OrderType) => {
  return useQuery({
    queryKey: ["buyer-orders", orderType],
    queryFn: async () => {
      const response = await fetch(`/api/buyer/orders?type=${orderType}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }
      
      const data = await response.json();
      return data.orders as Order[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - orders update more frequently
    refetchOnWindowFocus: true, // Refetch when user returns to tab
  });
};
