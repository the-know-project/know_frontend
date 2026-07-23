"use client";

import { capitalizeFirstLetter } from "@/src/utils/string-helpers";
import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import ExploreFollowButton from "./explore-follow-button";
import { useFetchProfileDetails } from "../../profile/hooks/use-fetch-artist-details";

interface ArtistInfoCardProps {
  artistId: string;
}

const ArtistInfoCard = ({ artistId }: ArtistInfoCardProps) => {
  const { user } = useOptimizedAuth();
  const { data: artistResponse, isLoading } = useFetchProfileDetails({
    userId: artistId,
  });

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
    return (
      <div className="font-grotesk text-xs font-light text-red-500">
        Artist not found.
      </div>
    );
  }

  const artist = artistResponse.data;

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="font-bebas mb-3 text-xs font-extrabold tracking-wide text-black uppercase">
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
          <h3 className="font-helvetica text-sm font-bold text-neutral-800 capitalize">
            {`${capitalizeFirstLetter(artist.firstName)} ${capitalizeFirstLetter(artist.lastName)}`}
          </h3>
          <p className="font-grotesk text-[12px] font-light text-neutral-600">
            Lagos, Nigeria
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {canFollow && <ExploreFollowButton artistId={artistId} />}
      </div>
    </div>
  );
};

export default ArtistInfoCard;
