import { useState } from "react";
import { useLikeAsset } from "./use-like-asset";
import { useUnlikeAsset } from "./use-unlike-asset";
import {
  useIsAssetLiked,
  useLikeCount,
  useLikedAssetsActions,
} from "../state/liked-assets-store";

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

/**
 * Unified hook for managing asset likes with Zustand store integration
 * Handles optimistic updates, error recovery, and loading states
 */
export const useAssetLike = ({
  assetId,
  initialLikeCount,
}: UseAssetLikeProps): UseAssetLikeReturn => {
  const { mutateAsync: handleLike, isPending: isLiking } = useLikeAsset();
  const { mutateAsync: handleUnlike, isPending: isUnliking } = useUnlikeAsset();

  const isLiked = useIsAssetLiked(assetId);
  const currentLikeCount = useLikeCount(assetId, initialLikeCount);
  const { addLikedAsset, removeLikedAsset } = useLikedAssetsActions();

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
      if (!wasLiked) {
        await handleLike({ fileId: assetId as string });
      } else {
        await handleUnlike({ fileId: assetId as string });
      }
    } catch (apiError) {
      // Rollback optimistic update
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
  const { initializeLikedAssets, clearLikedAssets } = useLikedAssetsActions();

  const initializeLikes = (assetIds: (string | number)[]) => {
    initializeLikedAssets(assetIds);
  };

  const clearAllLikes = () => {
    clearLikedAssets();
  };

  return {
    initializeLikes,
    clearAllLikes,
  };
};
