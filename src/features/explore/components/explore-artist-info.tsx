"use client";

import ArtistInfoCard from "./artist-info-card";
import ArtInfoCard from "./art-info-card";
import ArtTagsFilter from "./art-tags-filter";
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";

interface ExploreArtistInfoProps {
  artistId: string;
  artwork: IExploreContent;
}

const ExploreArtistInfo = ({ artistId, artwork }: ExploreArtistInfoProps) => {
  return (
    <div className="w-full space-y-4">
      <ArtistInfoCard artistId={artistId} />

      <ArtInfoCard artwork={artwork} />

      <ArtTagsFilter tags={artwork.tags || []} />
    </div>
  );
};

export default ExploreArtistInfo;
