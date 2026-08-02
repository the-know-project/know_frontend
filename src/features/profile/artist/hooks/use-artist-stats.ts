import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { artistStatsService } from "../services/artist-stats.service";
import { useCanFetchData } from "@/src/features/auth/hooks/use-optimized-auth";
import { useTokenStore } from "@/src/features/auth/state/store";

export const useUserMetrics = (
  userId?: string,
  period: "monthly" | "yearly" = "yearly",
) => {
  const canFetch = useCanFetchData();
  const currentUser = useTokenStore((state) => state.user);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const targetUserId = userId || currentUser?.id;

  return useQuery({
    queryKey: ["user-metrics", targetUserId, period],
    queryFn: () => artistStatsService.getUserMetrics(targetUserId!, period),
    enabled:
      canFetch && isAuthenticated && hasToken && hasHydrated && !!targetUserId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUserFollowers = (userId?: string) => {
  const canFetch = useCanFetchData();
  const currentUser = useTokenStore((state) => state.user);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const targetUserId = userId || currentUser?.id;

  return useQuery({
    queryKey: ["user-followers", targetUserId],
    queryFn: () => artistStatsService.getUserFollowers(targetUserId!),
    enabled:
      canFetch && isAuthenticated && hasToken && hasHydrated && !!targetUserId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUserFollowing = (userId?: string) => {
  const canFetch = useCanFetchData();
  const currentUser = useTokenStore((state) => state.user);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);
  const hasToken = useTokenStore((state) => !!state.accessToken);
  const hasHydrated = useTokenStore((state) => state.hasHydrated);

  const targetUserId = userId || currentUser?.id;

  return useQuery({
    queryKey: ["user-following", targetUserId],
    queryFn: () => artistStatsService.getUserFollowing(targetUserId!),
    enabled:
      canFetch && isAuthenticated && hasToken && hasHydrated && !!targetUserId,
    staleTime: 5 * 60 * 1000,
    retry: 1,
    retryDelay: 1000,
  });
};

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const currentUser = useTokenStore((state) => state.user);

  return useMutation({
    mutationFn: (targetUserId: string) =>
      artistStatsService.unfollowUser(currentUser!.id, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-followers"] });
      queryClient.invalidateQueries({ queryKey: ["user-following"] });
      queryClient.invalidateQueries({ queryKey: ["user-metrics"] });
    },
  });
};
