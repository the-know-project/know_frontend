"use client";

import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import ExploreCheckoutButton from "./explore-checkout-button";
import ExploreFollowButton from "./explore-follow-button";
// TODO: Create and import a hook to fetch artist details by ID
// import { useFetchArtistDetails } from "../hooks/use-fetch-artist-details";

interface ArtistInfoCardProps {
  artistId: string;
}

const ArtistInfoCard = ({ artistId }: ArtistInfoCardProps) => {
  const { role } = useOptimizedAuth(); // Get the current user's role

  // TODO: Fetch artist data using the artistId
  // const { data: artist, isLoading } = useFetchArtistDetails(artistId);

  // TODO: Implement the Follow/Unfollow logic using a useMutation hook
  const handleFollow = () => {
    console.log("Follow button clicked for artist:", artistId);
  };

  const handleCheckout = () => {
    console.log("Checkout button clicked");
  };

  // if (isLoading) {
  //   return <div>Loading artist...</div>;
  // }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Owner Label */}
      <div className="mb-3 text-xs font-extrabold tracking-wide text-black uppercase">
        OWNER
      </div>

      {/* Artist Info */}
      <div className="mb-4 flex items-center gap-3">
        <div className="h-12 w-12 overflow-hidden rounded-full bg-gray-200">
          <img
            src="https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face"
            alt="Victoria Hgdon"
            className="h-full w-full object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold text-gray-900">Victoria Hgdon</h3>
          <p className="text-sm text-gray-600">Lagos, Nigeria</p>
        </div>
      </div>

      <div className="space-y-3">
        <ExploreFollowButton />
        <ExploreCheckoutButton />
      </div>
    </div>
  );
};

export default ArtistInfoCard;
