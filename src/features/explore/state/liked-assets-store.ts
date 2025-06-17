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
  // Core state
  likedAssets: Map<string | number, LikedAsset>;

  // Actions
  addLikedAsset: (assetId: string | number, originalCount: number) => void;
  removeLikedAsset: (assetId: string | number, originalCount: number) => void;
  isAssetLiked: (assetId: string | number) => boolean;
  getLikeCount: (assetId: string | number, fallbackCount: number) => number;

  // Optimistic update management
  updateOptimisticCount: (assetId: string | number, newCount: number) => void;
  revertOptimisticUpdate: (assetId: string | number) => void;

  // Bulk operations
  initializeLikedAssets: (assetIds: (string | number)[]) => void;
  clearLikedAssets: () => void;

  // Utility
  getLikedAssetIds: () => (string | number)[];
  getTotalLikedCount: () => number;
}

export const useLikedAssetsStore = create<LikedAssetsState>()(
  persist(
    immer((set, get) => ({
      likedAssets: new Map(),

      addLikedAsset: (assetId, originalCount) =>
        set((state) => {
          state.likedAssets.set(assetId, {
            fileId: assetId,
            likedAt: new Date(),
            originalLikeCount: originalCount,
            optimisticLikeCount: originalCount + 1,
          });
        }),

      removeLikedAsset: (assetId, originalCount) =>
        set((state) => {
          const existingAsset = state.likedAssets.get(assetId);
          if (existingAsset) {
            state.likedAssets.delete(assetId);
          }
        }),

      isAssetLiked: (assetId) => {
        const state = get();
        return state.likedAssets.has(assetId);
      },

      getLikeCount: (assetId, fallbackCount) => {
        const state = get();
        const likedAsset = state.likedAssets.get(assetId);
        if (likedAsset) {
          return likedAsset.optimisticLikeCount;
        }
        return fallbackCount;
      },

      updateOptimisticCount: (assetId, newCount) =>
        set((state) => {
          const existingAsset = state.likedAssets.get(assetId);
          if (existingAsset) {
            existingAsset.optimisticLikeCount = newCount;
          }
        }),

      revertOptimisticUpdate: (assetId) =>
        set((state) => {
          const existingAsset = state.likedAssets.get(assetId);
          if (existingAsset) {
            existingAsset.optimisticLikeCount = existingAsset.originalLikeCount;
          }
        }),

      initializeLikedAssets: (assetIds) =>
        set((state) => {
          // Clear existing and add new ones
          state.likedAssets.clear();
          assetIds.forEach((assetId) => {
            state.likedAssets.set(assetId, {
              fileId: assetId,
              likedAt: new Date(),
              originalLikeCount: 0, // Will be updated when we have actual counts
              optimisticLikeCount: 0,
            });
          });
        }),

      clearLikedAssets: () =>
        set((state) => {
          state.likedAssets.clear();
        }),

      getLikedAssetIds: () => {
        const state = get();
        return Array.from(state.likedAssets.keys());
      },

      getTotalLikedCount: () => {
        const state = get();
        return state.likedAssets.size;
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
            // Convert the serialized array back to Map
            if (parsed.state && parsed.state.likedAssets) {
              parsed.state.likedAssets = new Map(
                parsed.state.likedAssets.map((item: any) => [
                  item[0],
                  {
                    ...item[1],
                    likedAt: new Date(item[1].likedAt),
                  },
                ]),
              );
            }
            return parsed;
          } catch (error) {
            console.error("Error parsing liked assets from storage:", error);
            return null;
          }
        },
        setItem: (name, value) => {
          try {
            // Convert Map to array for serialization
            const serialized = {
              ...value,
              state: {
                ...value.state,
                likedAssets: Array.from(value.state.likedAssets.entries()),
              },
            };
            localStorage.setItem(name, JSON.stringify(serialized));
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

// Actions hook
export const useLikedAssetsActions = () =>
  useLikedAssetsStore((state) => ({
    addLikedAsset: state.addLikedAsset,
    removeLikedAsset: state.removeLikedAsset,
    updateOptimisticCount: state.updateOptimisticCount,
    revertOptimisticUpdate: state.revertOptimisticUpdate,
    initializeLikedAssets: state.initializeLikedAssets,
    clearLikedAssets: state.clearLikedAssets,
  }));
