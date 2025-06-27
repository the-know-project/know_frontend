import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface LikedAsset {
  fileId: string | number;
  likedAt: Date;
  originalLikeCount: number;
  optimisticLikeCount: number;
}

interface LikedAssetsState {
  likedAssets: Record<string | number, LikedAsset>;

  addLikedAsset: (assetId: string | number, originalCount: number) => void;
  removeLikedAsset: (assetId: string | number) => void;
  isAssetLiked: (assetId: string | number) => boolean;
  getLikeCount: (assetId: string | number, fallbackCount: number) => number;

  updateOptimisticCount: (assetId: string | number, newCount: number) => void;
  revertOptimisticUpdate: (assetId: string | number) => void;

  initializeLikedAssets: (assetIds: (string | number)[]) => void;
  clearLikedAssets: () => void;

  getLikedAssetIds: () => (string | number)[];
  getTotalLikedCount: () => number;
}

export const useLikedAssetsStore = create<LikedAssetsState>()(
  persist(
    immer((set, get) => ({
      likedAssets: {},

      addLikedAsset: (assetId, originalCount) =>
        set((state) => {
          state.likedAssets[assetId] = {
            fileId: assetId,
            likedAt: new Date(),
            originalLikeCount: originalCount,
            optimisticLikeCount: originalCount + 1,
          };
        }),

      removeLikedAsset: (assetId) =>
        set((state) => {
          if (state.likedAssets[assetId]) {
            delete state.likedAssets[assetId];
          }
        }),

      isAssetLiked: (assetId) => {
        const state = get();
        return assetId in state.likedAssets;
      },

      getLikeCount: (assetId, fallbackCount) => {
        const state = get();
        const likedAsset = state.likedAssets[assetId];
        if (likedAsset) {
          return likedAsset.optimisticLikeCount;
        }
        return fallbackCount;
      },

      updateOptimisticCount: (assetId, newCount) =>
        set((state) => {
          const existingAsset = state.likedAssets[assetId];
          if (existingAsset) {
            existingAsset.optimisticLikeCount = newCount;
          }
        }),

      revertOptimisticUpdate: (assetId) =>
        set((state) => {
          const existingAsset = state.likedAssets[assetId];
          if (existingAsset) {
            existingAsset.optimisticLikeCount = existingAsset.originalLikeCount;
          }
        }),

      initializeLikedAssets: (assetIds) =>
        set((state) => {
          // Clear existing and add new ones
          state.likedAssets = {};
          assetIds.forEach((assetId) => {
            state.likedAssets[assetId] = {
              fileId: assetId,
              likedAt: new Date(),
              originalLikeCount: 0, // Will be updated when we have actual counts
              optimisticLikeCount: 0,
            };
          });
        }),

      clearLikedAssets: () =>
        set((state) => {
          state.likedAssets = {};
        }),

      getLikedAssetIds: () => {
        const state = get();
        return Object.keys(state.likedAssets);
      },

      getTotalLikedCount: () => {
        const state = get();
        return Object.keys(state.likedAssets).length;
      },
    })),
    {
      name: "liked-assets-storage",
      storage: {
        getItem: (name) => {
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);
            // Convert date strings back to Date objects
            if (parsed.state && parsed.state.likedAssets) {
              Object.values(parsed.state.likedAssets).forEach((asset: any) => {
                if (asset.likedAt) {
                  asset.likedAt = new Date(asset.likedAt);
                }
              });
            }
            return parsed;
          } catch (error) {
            console.error("Error parsing liked assets from storage:", error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            // No special serialization needed for objects
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.error("Error saving liked assets to storage:", error);
          }
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

export const useLikedAssetIds = () =>
  useLikedAssetsStore((state) => state.getLikedAssetIds());

export const useIsAssetLiked = (assetId: string | number) =>
  useLikedAssetsStore((state) => state.isAssetLiked(assetId));

export const useLikeCount = (assetId: string | number, fallbackCount: number) =>
  useLikedAssetsStore((state) => state.getLikeCount(assetId, fallbackCount));

export const useTotalLikedCount = () =>
  useLikedAssetsStore((state) => state.getTotalLikedCount());

// Actions hook with stable references
export const useLikedAssetsActions = () => {
  const addLikedAsset = useLikedAssetsStore((state) => state.addLikedAsset);
  const removeLikedAsset = useLikedAssetsStore(
    (state) => state.removeLikedAsset,
  );
  const updateOptimisticCount = useLikedAssetsStore(
    (state) => state.updateOptimisticCount,
  );
  const revertOptimisticUpdate = useLikedAssetsStore(
    (state) => state.revertOptimisticUpdate,
  );
  const initializeLikedAssets = useLikedAssetsStore(
    (state) => state.initializeLikedAssets,
  );
  const clearLikedAssets = useLikedAssetsStore(
    (state) => state.clearLikedAssets,
  );

  return {
    addLikedAsset,
    removeLikedAsset,
    updateOptimisticCount,
    revertOptimisticUpdate,
    initializeLikedAssets,
    clearLikedAssets,
  };
};
