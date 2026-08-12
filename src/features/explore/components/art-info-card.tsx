"use client";

import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import ExploreCheckoutButton from "./explore-checkout-button";
import { logger } from "@/src/utils/logger";

interface ArtInfoCardProps {
  artwork: IExploreContent;
}

const ArtInfoCard = ({ artwork }: ArtInfoCardProps) => {
  const { user, role } = useOptimizedAuth();

  const canCheckout = user?.id !== artwork.userId;

  logger.debug("Art work", {
    artwork,
  });

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h2 className="font-helvetica text-sm font-bold text-neutral-800 capitalize">
          {artwork.artName}
        </h2>
        {artwork.size && (
          <div className="font-azeret py-4 text-[12px] font-light text-neutral-600">
            {artwork.size.height && (
              <p>
                Height: {artwork.size.height}
                {artwork.size.dimensionUnit}
              </p>
            )}

            {artwork.size.width && (
              <p>
                Width: {artwork.size.width}
                {artwork.size.dimensionUnit}
              </p>
            )}
            {artwork.size.depth && <p>Depth: {artwork.size.depth}</p>}
            {artwork.size.weight && (
              <p>
                Weight: {artwork.size.weight}
                {artwork.size.weightUnit}
              </p>
            )}
            {artwork.size.diameter && (
              <p>Diameter: {artwork.size.diameter}mm</p>
            )}
            {artwork.size.aspectRatio && (
              <p>Aspect Ratio: {artwork.size.aspectRatio}</p>
            )}
          </div>
        )}
        +
      </div>

      {/* Stats */}
      <div className="font-grotesk mb-4 flex items-center gap-4 text-sm text-neutral-500">
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
          <span className="font-medium">{artwork.numOfViews || "0"}</span>
        </div>
        <div className="flex items-center gap-1">
          <svg
            className="h-4 w-4"
            fill={artwork.numOfLikes > 0 ? "red" : "none"}
            stroke={artwork.numOfLikes > 0 ? "red" : "currentColor"}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span className="font-medium">{artwork.numOfLikes}</span>
        </div>
      </div>

      {/* Published Date */}
      <p className="font-grotesk text-[12px] font-light text-neutral-600">
        Published on: {new Date(artwork.createdAt).toLocaleDateString()}
      </p>

      {/* Price and Checkout Button */}
      <div className="space-y-4 py-4">
        {artwork.isListed && (
          <div className="text-center">
            <div className="font-bebas rounded-lg bg-[#1E3A8A] px-4 py-2 text-xl font-semibold tracking-wider text-white">
              {artwork.price}
            </div>
          </div>
        )}
        {artwork.isListed && canCheckout && (
          <ExploreCheckoutButton artworkId={artwork.id} />
        )}
      </div>
    </div>
  );
};

export default ArtInfoCard;
