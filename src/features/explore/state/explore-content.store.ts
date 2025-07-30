import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface IExploreContentState {
  toggleExploreContent: (
    id: string,
    viewportPosition?: { scrollY: number; viewportHeight: number },
  ) => void;
  toggledContentId: string | null;
  viewportPosition: { scrollY: number; viewportHeight: number } | null;
}

const useExploreContentStore = create<IExploreContentState>()(
  persist(
    immer((set) => ({
      toggleExploreContent: (
        id: string,
        viewportPosition?: { scrollY: number; viewportHeight: number },
      ) =>
        set((state) => ({
          toggledContentId: state.toggledContentId === id ? null : id,
          viewportPosition:
            state.toggledContentId === id ? null : viewportPosition || null,
        })),
      toggledContentId: null,
      viewportPosition: null,
    })),
    {
      name: "explore-content-store",
    },
  ),
);

export const useToggleExploreContent = () =>
  useExploreContentStore((state) => state.toggleExploreContent);

export const useIsExploreContentToggled = () => ({
  isExploreContentToggled: useExploreContentStore(
    (state) => state.toggledContentId !== null,
  ),
  toggledContentId: useExploreContentStore((state) => state.toggledContentId),
  viewportPosition: useExploreContentStore((state) => state.viewportPosition),
});
