"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useLikeItem = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ itemId, isLiked }: { itemId: string; isLiked: boolean }) => {
      const response = await fetch("/api/buyer/like", {
        method: isLiked ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId }),
      });

      if (!response.ok) {
        throw new Error("Failed to update like");
      }

      return response.json();
    },
    onMutate: async ({ itemId, isLiked }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ["buyer-orders"] });

      // Snapshot previous values
      const previousOrders = queryClient.getQueryData(["buyer-orders"]);

      // Optimistically update
      queryClient.setQueriesData(
        { queryKey: ["buyer-orders"] },
        (old: any) => {
          if (!old) return old;
          return {
            ...old,
            orders: old.orders?.map((order: Order) =>
              order.id === itemId
                ? { ...order, likes: (order.likes || 0) + (isLiked ? -1 : 1) }
                : order
            ),
          };
        }
      );

      return { previousOrders };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousOrders) {
        queryClient.setQueryData(["buyer-orders"], context.previousOrders);
      }
    },
    onSettled: () => {
      // Refetch after mutation
      queryClient.invalidateQueries({ queryKey: ["buyer-orders"] });
    },
  });
};
