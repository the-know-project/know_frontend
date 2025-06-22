import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import { TAsset, TFetchExploreAsset } from "../types/explore.types";

interface InfiniteExploreState {
  assets: TAsset[];
  currentPage: number;
  hasNextPage: boolean;
  totalPages: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  error: string | null;

  filters: Omit<TFetchExploreAsset, "page" | "limit" | "userId">;

  setAssets: (assets: TAsset[]) => void;
  appendAssets: (assets: TAsset[]) => void;
  setCurrentPage: (page: number) => void;
  incrementPage: () => void;
  setHasNextPage: (hasNext: boolean) => void;
  setTotalPages: (total: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingMore: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilters: (
    filters: Omit<TFetchExploreAsset, "page" | "limit" | "userId">,
  ) => void;
  resetState: () => void;
  resetPagination: () => void;
}

const initialState = {
  assets: [],
  currentPage: 1,
  hasNextPage: true,
  totalPages: 0,
  isLoading: false,
  isLoadingMore: false,
  error: null,
  filters: {},
};

export const useInfiniteExploreStore = create<InfiniteExploreState>()(
  subscribeWithSelector((set, get) => ({
    ...initialState,

    setAssets: (assets) => set({ assets }),

    appendAssets: (newAssets) =>
      set((state) => ({
        assets: [...state.assets, ...newAssets],
      })),

    setCurrentPage: (page) => set({ currentPage: page }),

    incrementPage: () =>
      set((state) => ({
        currentPage: state.currentPage + 1,
      })),

    setHasNextPage: (hasNext) => set({ hasNextPage: hasNext }),

    setTotalPages: (total) => set({ totalPages: total }),

    setIsLoading: (loading) => set({ isLoading: loading }),

    setIsLoadingMore: (loading) => set({ isLoadingMore: loading }),

    setError: (error) => set({ error }),

    setFilters: (filters) =>
      set((state) => {
        // If filters changed, reset pagination
        const filtersChanged =
          JSON.stringify(state.filters) !== JSON.stringify(filters);
        if (filtersChanged) {
          return {
            filters,
            currentPage: 1,
            assets: [],
            hasNextPage: true,
            error: null,
          };
        }
        return { filters };
      }),

    resetState: () => set(initialState),

    resetPagination: () =>
      set({
        currentPage: 1,
        assets: [],
        hasNextPage: true,
        error: null,
      }),
  })),
);

export const useInfiniteExploreSelectors = {
  assets: () => useInfiniteExploreStore((state) => state.assets),
  currentPage: () => useInfiniteExploreStore((state) => state.currentPage),
  hasNextPage: () => useInfiniteExploreStore((state) => state.hasNextPage),
  isLoading: () => useInfiniteExploreStore((state) => state.isLoading),
  isLoadingMore: () => useInfiniteExploreStore((state) => state.isLoadingMore),
  error: () => useInfiniteExploreStore((state) => state.error),
  filters: () => useInfiniteExploreStore((state) => state.filters),

  isEmpty: () => useInfiniteExploreStore((state) => state.assets.length === 0),
  canLoadMore: () =>
    useInfiniteExploreStore(
      (state) => state.hasNextPage && !state.isLoading && !state.isLoadingMore,
    ),
};
