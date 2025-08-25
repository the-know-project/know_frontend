import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useEffect, useRef } from "react";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserLikes } from "../api/fetch-user-likes/route";
import { ExploreError } from "../errors/explore.error";
import { useLikedAssetsActions } from "../state/liked-assets-store";
import { useLikedAssetsWithCounts } from "./use-fetch-liked-assets";
import { showLog } from "@/src/utils/logger";

export const useSyncLikedAssets = () => {
  const { initializeLikedAssetsWithCounts } = useLikedAssetsActions();
  const hasInitialized = useRef(false);

  const { likedAssetsWithCounts, isLoading, error } =
    useLikedAssetsWithCounts();

  useEffect(() => {
    if (
      !isLoading &&
      likedAssetsWithCounts.length > 0 &&
      !hasInitialized.current
    ) {
      initializeLikedAssetsWithCounts(likedAssetsWithCounts);
      hasInitialized.current = true;
    }
  }, [likedAssetsWithCounts, isLoading, initializeLikedAssetsWithCounts]);

  return {
    isLoading,
    error,
    isInitialized: !isLoading,
  };
};

export const usePeriodicSyncLikedAssets = (
  intervalMs: number = 5 * 60 * 1000,
) => {
  const userId = useTokenStore((state) => state.user?.id);
  const { initializeLikedAssetsWithCounts } = useLikedAssetsActions();

  const { data, isLoading, error } = useQuery({
    queryKey: ["liked-assets-sync", userId],
    queryFn: async () => {
      if (!userId) return null;

      const result = await ResultAsync.fromPromise(
        fetchUserLikes(userId),
        (error) => new ExploreError(`Error fetching liked assets: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Failed to fetch liked assets: ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      showLog({
        context: "Like Sync logs",
        data: result.value,
      });
      return result.value;
    },
    enabled: !!userId,
    refetchInterval: intervalMs,
    staleTime: intervalMs / 2,
  });

  useEffect(() => {
    if (data && Array.isArray(data)) {
      console.log("data", data);
      initializeLikedAssetsWithCounts(data);
    }
  }, [data, initializeLikedAssetsWithCounts]);

  return {
    isLoading,
    error,
    lastSyncTime: data ? new Date() : null,
  };
};
