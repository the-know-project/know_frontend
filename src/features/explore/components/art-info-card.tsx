"use client";

import { CalendarDays, Eye, Heart, Ruler } from "lucide-react";
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import ExploreCheckoutButton from "./explore-checkout-button";

interface ArtInfoCardProps {
  artwork: IExploreContent;
}

const ArtInfoCard = ({ artwork }: ArtInfoCardProps) => {
  const { user } = useOptimizedAuth();
  const canCheckout = user?.id !== artwork.userId;
  const size = artwork.size;
  const dimensions: { label: string; value: string }[] = [];
  if (size.width)
    dimensions.push({
      label: "Width",
      value: `${size.width}${size.dimensionUnit || ""}`,
    });
  if (size.height)
    dimensions.push({
      label: "Height",
      value: `${size.height}${size.dimensionUnit || ""}`,
    });
  if (size.depth)
    dimensions.push({
      label: "Depth",
      value: `${size.depth}${size.dimensionUnit || ""}`,
    });
  if (size.length)
    dimensions.push({
      label: "Length",
      value: `${size.length}${size.dimensionUnit || ""}`,
    });
  if (size.diameter)
    dimensions.push({
      label: "Diameter",
      value: `${size.diameter}${size.dimensionUnit || ""}`,
    });
  if (size.weight)
    dimensions.push({
      label: "Weight",
      value: `${size.weight}${size.weightUnit || ""}`,
    });
  const publishedDate = new Date(artwork.createdAt);
  const formattedDate = Number.isNaN(publishedDate.getTime())
    ? "Date unavailable"
    : new Intl.DateTimeFormat("en", {
        year: "numeric",
        month: "short",
        day: "numeric",
      }).format(publishedDate);
  const price =
    typeof artwork.price === "number"
      ? new Intl.NumberFormat("en", { maximumFractionDigits: 2 }).format(
          artwork.price,
        )
      : artwork.price;

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4">
        <p className="font-grotesk text-xs font-semibold tracking-[0.16em] text-neutral-400 uppercase">
          Artwork details
        </p>
        <h2 className="font-helvetica mt-1 text-lg font-bold break-words text-neutral-900">
          {artwork.artName}
        </h2>
      </div>

      {artwork.description && (
        <p className="font-grotesk mb-4 text-sm leading-6 break-words whitespace-pre-wrap text-neutral-600">
          {artwork.description}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        <span className="font-grotesk inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-neutral-50 px-2.5 text-xs font-medium text-neutral-600">
          <Eye className="h-3.5 w-3.5" />
          {artwork.numOfViews || 0} views
        </span>
        <span className="font-grotesk inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-rose-50 px-2.5 text-xs font-medium text-rose-700">
          <Heart className="h-3.5 w-3.5" />
          {artwork.numOfLikes || 0} likes
        </span>
        <span className="font-grotesk inline-flex min-h-8 items-center gap-1.5 rounded-lg bg-indigo-50 px-2.5 text-xs font-medium text-indigo-700">
          <CalendarDays className="h-3.5 w-3.5" />
          {formattedDate}
        </span>
      </div>

      {dimensions.length > 0 && (
        <div className="border-t border-neutral-100 pt-4">
          <div className="mb-2 flex items-center gap-2">
            <Ruler className="h-4 w-4 text-neutral-500" />
            <h3 className="font-grotesk text-xs font-semibold text-neutral-700">
              Dimensions
            </h3>
          </div>
          <dl className="grid grid-cols-2 gap-2">
            {dimensions.map((dimension) => (
              <div
                key={dimension.label}
                className="rounded-lg bg-neutral-50 px-3 py-2"
              >
                <dt className="font-grotesk text-[10px] text-neutral-400">
                  {dimension.label}
                </dt>
                <dd className="font-grotesk mt-0.5 text-xs font-medium text-neutral-700">
                  {dimension.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      )}

      {artwork.isListed && (
        <div className="mt-4 border-t border-neutral-100 pt-4">
          <div className="mb-3 flex items-baseline justify-between gap-3">
            <span className="font-grotesk text-xs font-medium text-neutral-500">
              Listed price
            </span>
            <span className="font-helvetica text-xl font-bold text-neutral-900 tabular-nums">
              {price}
            </span>
          </div>
          {canCheckout && <ExploreCheckoutButton artworkId={artwork.id} />}
        </div>
      )}
    </section>
  );
};

export default ArtInfoCard;
