"use client";

import { capitalizeFirstLetter } from "@/src/utils/string-helpers";
import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import { useFetchArtistDetails } from "../../profile/hooks/use-fetch-artist-details";
import ExploreCheckoutButton from "./explore-checkout-button";
import ExploreFollowButton from "./explore-follow-button";

interface ArtistInfoCardProps {
  artistId: string;
}

const ArtistInfoCard = ({ artistId }: ArtistInfoCardProps) => {
  const { user } = useOptimizedAuth();
  const { data: artistResponse, isLoading } = useFetchArtistDetails(artistId);

  const canFollow = user?.id !== artistId;

  if (isLoading) {
    return (
      <div className="animate-pulse rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
        <div className="mb-3 h-3 w-1/4 rounded bg-gray-200"></div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gray-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-gray-200"></div>
            <div className="h-3 w-24 rounded bg-gray-200"></div>
          </div>
        </div>
        <div className="h-12 w-full rounded-lg bg-gray-200"></div>
      </div>
    );
  }

  if (!artistResponse?.data) {
    return <div className="text-red-500">Artist not found.</div>;
  }

  const artist = artistResponse.data;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-3 text-xs font-extrabold tracking-wide text-black uppercase">
        OWNER
      </div>

      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          <img
            src={artist.imageUrl || "/default-profile.png"}
            alt={`{artist.firstName} ${artist.lastName}`}
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">
            {`${capitalizeFirstLetter(artist.firstName)} ${capitalizeFirstLetter(artist.lastName)}`}
          </h3>
          <p className="text-sm text-gray-600">Lagos, Nigeria</p>
        </div>
      </div>

      <div className="space-y-3">
        {canFollow && <ExploreFollowButton />}
        <ExploreCheckoutButton />
      </div>
    </div>
  );
};

export default ArtistInfoCard;
