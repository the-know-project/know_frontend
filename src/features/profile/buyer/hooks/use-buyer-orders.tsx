import { useQuery } from "@tanstack/react-query";
import { buyerOrdersService } from "../services/buyer-orders.service";
import { useCanFetchData } from "@/src/features/auth/hooks/use-optimized-auth";
import { useTokenStore } from "@/src/features/auth/state/store";

// Cart orders
export const useBuyerCart = () => {
  const canFetch = useCanFetchData();
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["buyer-cart"],
    queryFn: () => buyerOrdersService.fetchUserOrders("cart"),
    enabled: canFetch && isAuthenticated && hasToken && hasHydrated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000, // Wait 1 second before retrying
  });
};

// Pending orders
export const useBuyerPendingOrders = () => {
  const canFetch = useCanFetchData();
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["buyer-pending-orders"],
    queryFn: () => buyerOrdersService.fetchUserOrders("pending"),
    enabled: canFetch && isAuthenticated && hasToken && hasHydrated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

// Completed orders
export const useBuyerCompletedOrders = () => {
  const canFetch = useCanFetchData();
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["buyer-completed-orders"],
    queryFn: () => buyerOrdersService.fetchUserOrders("completed"),
    enabled: canFetch && isAuthenticated && hasToken && hasHydrated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

// Order summary
export const useBuyerOrderSummary = () => {
  const canFetch = useCanFetchData();
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["buyer-order-summary"],
    queryFn: () => buyerOrdersService.fetchOrderSummary(),
    enabled: canFetch && isAuthenticated && hasToken && hasHydrated,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

// Single order by ID
export const useBuyerOrderById = (orderId: string | undefined) => {
  const canFetch = useCanFetchData();
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  return useQuery({
    queryKey: ["buyer-order", orderId],
    queryFn: () => buyerOrdersService.fetchOrderById(orderId!),
    enabled:
      canFetch && isAuthenticated && hasToken && hasHydrated && !!orderId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};
