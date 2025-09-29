"use client";

import ArtistInfoCard from "./artist-info-card";
import ArtInfoCard from "./art-info-card";
import ArtTagsFilter from "./art-tags-filter";

interface ExploreArtistInfoProps {
  artistId: string;
  artworkId: string;
  onTagSelect?: (tags: string[]) => void;
  selectedTags?: string[];
}

const ExploreArtistInfo = ({
  artistId,
  artworkId,
  onTagSelect,
  selectedTags = [],
}: ExploreArtistInfoProps) => {
  return (
    <div className="w-full space-y-4">
      {/* Artist Info Card with Follow/Checkout */}
      <ArtistInfoCard artistId={artistId} />

      {/* Art Info Card with Details and Price */}
      <ArtInfoCard artworkId={artworkId} />

      {/* Tags Filter */}
      <ArtTagsFilter onTagSelect={onTagSelect} selectedTags={selectedTags} />
    </div>
  );
};

export default ExploreArtistInfo;
