import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IExploreContentState {
  toggleExploreContent: (
    id: string,
    ctx: IExploreContent | null,
    viewportPosition?: { scrollY: number; viewportHeight: number },
  ) => void;
  toggledContentId: string | null;
  viewportPosition: { scrollY: number; viewportHeight: number } | null;
  exploreContent: IExploreContent | null;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

const useExploreContentStore = create<IExploreContentState>()(
  subscribeWithSelector(
    persist(
      immer((set) => ({
        toggleExploreContent: (
          id: string,
          ctx: IExploreContent | null,
          viewportPosition?: { scrollY: number; viewportHeight: number },
        ) =>
          set((state) => ({
            toggledContentId: state.toggledContentId === id ? null : id,
            viewportPosition:
              state.toggledContentId === id ? null : viewportPosition || null,
            exploreContent:
              ctx && state.exploreContent && ctx.id === state.exploreContent.id
                ? null
                : ctx || null,
          })),
        toggledContentId: null,
        viewportPosition: null,
        exploreContent: null,
        _hasHydrated: false,
        setHasHydrated: (state) =>
          set(() => ({
            _hasHydrated: state,
          })),
      })),
      {
        name: "explore-content-store",
        onRehydrateStorage: () => (state) => {
          state?.setHasHydrated(true);
        },
      },
    ),
  ),
);

export const useToggleExploreContent = () =>
  useExploreContentStore((state) => state.toggleExploreContent);

export const useExploreContentHydration = () =>
  useExploreContentStore((state) => state._hasHydrated);

export const useIsExploreContentToggled = () => ({
  isExploreContentToggled: useExploreContentStore(
    (state) => state.toggledContentId !== null,
  ),
  toggledContentId: useExploreContentStore((state) => state.toggledContentId),
  viewportPosition: useExploreContentStore((state) => state.viewportPosition),
  exploreContent: useExploreContentStore((state) => state.exploreContent),
});
