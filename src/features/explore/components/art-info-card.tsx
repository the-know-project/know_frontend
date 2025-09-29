"use client";

import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
// TODO: Create and import a hook to fetch artwork details by ID
// import { useFetchArtworkDetails } from "../hooks/use-fetch-artwork-details";

interface ArtInfoCardProps {
  artworkId: string;
}

const ArtInfoCard = ({ artworkId }: ArtInfoCardProps) => {
  const { role } = useOptimizedAuth(); // Get the current user's role

  // TODO: Fetch artwork data using the artworkId
  // const { data: artwork, isLoading } = useFetchArtworkDetails(artworkId);

  // TODO: Implement the Add to Cart/Checkout logic using a useMutation hook
  const handleCheckout = () => {
    console.log("Checkout button clicked for artwork:", artworkId);
  };

  // if (isLoading) {
  //   return <div>Loading artwork...</div>;
  // }

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Artwork Title and Details */}
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-bold text-gray-900">
          Angels of Thanopeleus
        </h2>
        <div className="space-y-1 text-sm text-gray-600">
          <p>Height: 60cm</p>
          <p>Width: 90cm</p>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 flex items-center gap-4 text-sm text-gray-500">
        <div className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          <span>1K</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span>1.6k</span>
        </div>
      </div>

      {/* Published Date */}
      <p className="mb-4 text-xs text-gray-500">Published 8th July 2025</p>

      {/* Price and Checkout Button */}
      <div className="space-y-3">
        <div className="text-center">
          <div className="rounded-lg bg-[#1E3A8A] px-4 py-2 text-xl font-semibold text-white">
            $500
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtInfoCard;
