import { useIsExploreContentToggled, useToggleExploreContent } from "../state/explore-content.store";
import { useArtistPortalStore } from "../state/artist-portal.store";

export function useOpenArtistPortal() {
  const toggleExploreContent = useToggleExploreContent();
  const { toggledContentId } = useIsExploreContentToggled();
  const openArtistPortal = useArtistPortalStore((state) => state.openArtistPortal);

  return (artistId: string) => {
    if (toggledContentId) toggleExploreContent(toggledContentId, null);
    openArtistPortal(artistId);
  };
}
