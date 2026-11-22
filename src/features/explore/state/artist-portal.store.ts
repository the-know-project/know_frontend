import { create } from "zustand";

interface ArtistPortalState {
  artistId: string | null;
  openArtistPortal: (artistId: string) => void;
  closeArtistPortal: () => void;
}

export const useArtistPortalStore = create<ArtistPortalState>((set) => ({
  artistId: null,
  openArtistPortal: (artistId) => set({ artistId }),
  closeArtistPortal: () => set({ artistId: null }),
}));
