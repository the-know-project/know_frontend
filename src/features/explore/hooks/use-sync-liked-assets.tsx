import { useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { useLikedAssetsActions } from "../state/liked-assets-store";
import { useLikedAssetIds } from "./use-fetch-liked-assets";

/**
 * Hook to sync the Zustand liked assets store with server data
 * This runs automatically when the component mounts and initializes
 * the store with the user's liked assets from the server
 */
export const useSyncLikedAssets = () => {
  const userId = useTokenStore((state) => state.user?.id);
  const { initializeLikedAssets } = useLikedAssetsActions();
  const hasInitialized = useRef(false);

  // Fetch liked assets from server
  const { likedAssetIds, isLoading, error } = useLikedAssetIds();

  // Sync with server data when available (only once)
  useEffect(() => {
    if (!isLoading && likedAssetIds.length > 0 && !hasInitialized.current) {
      initializeLikedAssets(likedAssetIds);
      hasInitialized.current = true;
    }
  }, [likedAssetIds, isLoading]); // Remove initializeLikedAssets from deps

  return {
    isLoading,
    error,
    isInitialized: !isLoading,
  };
};

/**
 * Hook to periodically sync liked assets with server
 * Useful for keeping the local state fresh with server changes
 */
export const usePeriodicSyncLikedAssets = (
  intervalMs: number = 5 * 60 * 1000,
) => {
  const userId = useTokenStore((state) => state.user?.id);
  const { initializeLikedAssets } = useLikedAssetsActions();

  const { data, isLoading, error } = useQuery({
    queryKey: ["liked-assets-sync", userId],
    queryFn: async () => {
      if (!userId) return null;

      const response = await fetch(`/api/users/${userId}/liked-assets`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to sync liked assets: ${response.statusText}`);
      }

      const result = await response.json();
      return result.data.likedAssets.map((asset: any) => asset.fileId);
    },
    enabled: !!userId,
    refetchInterval: intervalMs,
    staleTime: intervalMs / 2, // Half of the refetch interval
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      initializeLikedAssets(data);
    }
  }, [data]); // Remove initializeLikedAssets from deps

  return {
    isLoading,
    error,
    lastSyncTime: data ? new Date() : null,
  };
};
