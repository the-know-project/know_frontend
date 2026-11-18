"use client";

import ArtistInfoCard from "./artist-info-card";
import ArtInfoCard from "./art-info-card";
import ArtTagsFilter from "./art-tags-filter";
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";

interface ExploreArtistInfoProps {
  artistId: string;
  artwork: IExploreContent;

  userId?: string;
}

const ExploreArtistInfo = ({ artistId, artwork }: ExploreArtistInfoProps) => {
  return (
    <aside
      aria-label="Artist and artwork information"
      className="w-full space-y-3 sm:space-y-4"
    >
      <ArtistInfoCard
        artistId={artistId}
        artistName={artwork.creatorName}
        artistImage={artwork.creatorProfileUrl}
      />

      <ArtInfoCard artwork={artwork} />

      {artwork.tags && artwork.tags.length > 0 && (
        <ArtTagsFilter tags={artwork.tags} />
      )}
    </aside>
  );
};

export default ExploreArtistInfo;
