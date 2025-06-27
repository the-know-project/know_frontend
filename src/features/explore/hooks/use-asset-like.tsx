import { useState } from "react";
import { useLikeAsset } from "./use-like-asset";
import { useUnlikeAsset } from "./use-unlike-asset";
import {
  useIsAssetLiked,
  useLikeCount,
  useLikedAssetsActions,
} from "../state/liked-assets-store";
import { useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";

interface UseAssetLikeProps {
  assetId: string | number;
  initialLikeCount: number;
}

interface UseAssetLikeReturn {
  isLiked: boolean;
  likeCount: number;
  toggleLike: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

export const useAssetLike = ({
  assetId,
  initialLikeCount,
}: UseAssetLikeProps): UseAssetLikeReturn => {
  const { mutateAsync: handleLike, isPending: isLiking } = useLikeAsset();
  const { mutateAsync: handleUnlike, isPending: isUnliking } = useUnlikeAsset();

  const isLiked = useIsAssetLiked(assetId);
  const currentLikeCount = useLikeCount(assetId, initialLikeCount);
  const { addLikedAsset, removeLikedAsset, initializeLikedAssetsWithCounts } =
    useLikedAssetsActions();

  const queryClient = useQueryClient();
  const userId = useTokenStore((state) => state.user?.id);
  const [error, setError] = useState<string | null>(null);

  const toggleLike = async () => {
    const wasLiked = isLiked;
    setError(null);

    try {
      // Optimistic update
      if (!wasLiked) {
        addLikedAsset(assetId, initialLikeCount);
      } else {
        removeLikedAsset(assetId);
      }

      // API call
      let serverResponse;
      if (!wasLiked) {
        serverResponse = await handleLike({ fileId: assetId as string });
      } else {
        serverResponse = await handleUnlike({ fileId: assetId as string });
      }

      if (serverResponse && serverResponse.data) {
        const { fileId, numOfLikes } = serverResponse.data;
        if (fileId && typeof numOfLikes === "number") {
          initializeLikedAssetsWithCounts([{ fileId, numOfLikes }]);
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["liked-assets", userId],
      });
    } catch (apiError) {
      if (!wasLiked) {
        removeLikedAsset(assetId);
      } else {
        addLikedAsset(assetId, initialLikeCount);
      }

      const errorMessage =
        apiError instanceof Error
          ? apiError.message
          : "Failed to update like status";

      setError(errorMessage);
      console.error("Error toggling like:", apiError);
    }
  };

  return {
    isLiked,
    likeCount: currentLikeCount,
    toggleLike,
    isLoading: isLiking || isUnliking,
    error,
  };
};

export const useIsLiked = (assetId: string | number) => {
  return useIsAssetLiked(assetId);
};

export const useAssetLikeCount = (
  assetId: string | number,
  fallbackCount: number,
) => {
  return useLikeCount(assetId, fallbackCount);
};

export const useBulkLikeActions = () => {
  const { initializeLikedAssetsWithCounts, clearLikedAssets } =
    useLikedAssetsActions();

  const initializeLikesWithCounts = (
    assets: Array<{ fileId: string; numOfLikes: number }>,
  ) => {
    initializeLikedAssetsWithCounts(assets);
  };

  const clearAllLikes = () => {
    clearLikedAssets();
  };

  return {
    initializeLikesWithCounts,
    clearAllLikes,
  };
};
