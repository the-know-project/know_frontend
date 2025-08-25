import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface LikedAsset {
  fileId: string | number;
  likedAt: Date;
  originalLikeCount: number;
  optimisticLikeCount: number;
  isServerSynced: boolean;
  serverLikeCount?: number;
}

interface LikedAssetsState {
  likedAssets: Record<string | number, LikedAsset>;

  addLikedAsset: (assetId: string | number, originalCount: number) => void;
  removeLikedAsset: (assetId: string | number) => void;
  isAssetLiked: (assetId: string | number) => boolean;
  getLikeCount: (assetId: string | number, fallbackCount: number) => number;

  updateOptimisticCount: (assetId: string | number, newCount: number) => void;
  revertOptimisticUpdate: (assetId: string | number) => void;

  initializeLikedAssetsWithCounts: (
    assets: Array<{ fileId: string; numOfLikes: number }>,
  ) => void;
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
            isServerSynced: false, // This is a local like action
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
          if (
            likedAsset.isServerSynced &&
            likedAsset.serverLikeCount !== undefined
          ) {
            return likedAsset.serverLikeCount;
          }
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

      initializeLikedAssetsWithCounts: (assets) =>
        set((state) => {
          assets.forEach(({ fileId, numOfLikes }) => {
            const existingAsset = state.likedAssets[fileId];
            if (!existingAsset || existingAsset.isServerSynced) {
              state.likedAssets[fileId] = {
                fileId,
                likedAt: new Date(),
                originalLikeCount: numOfLikes,
                optimisticLikeCount: numOfLikes,
                isServerSynced: true,
                serverLikeCount: numOfLikes,
              };
            }
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
          if (typeof window === "undefined") return null;
          const str = localStorage.getItem(name);
          if (!str) return null;

          try {
            const parsed = JSON.parse(str);
            if (parsed.state && parsed.state.likedAssets) {
              Object.values(parsed.state.likedAssets).forEach((asset: any) => {
                if (asset.likedAt) {
                  asset.likedAt = new Date(asset.likedAt);
                }
              });
            }
            return parsed;
          } catch {
            return null;
          }
        },
        setItem: (name, value) => {
          if (typeof window === "undefined") return;
          try {
            localStorage.setItem(name, JSON.stringify(value));
          } catch (error) {
            console.warn("Failed to save to localStorage:", error);
          }
        },
        removeItem: (name) => {
          if (typeof window === "undefined") return;
          localStorage.removeItem(name);
        },
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

  const initializeLikedAssetsWithCounts = useLikedAssetsStore(
    (state) => state.initializeLikedAssetsWithCounts,
  );
  const clearLikedAssets = useLikedAssetsStore(
    (state) => state.clearLikedAssets,
  );

  return {
    addLikedAsset,
    removeLikedAsset,
    updateOptimisticCount,
    revertOptimisticUpdate,
    initializeLikedAssetsWithCounts,
    clearLikedAssets,
  };
};
