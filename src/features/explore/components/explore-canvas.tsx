"use client";

import ExploreCard from "./explore-card";
import { ExploreCardSkeletonGrid } from "./explore-card-skeleton";
import { TAsset } from "../types/explore.types";
import { useInfiniteExploreAssets } from "../hooks/use-infinite-explore-assets";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";
import InfiniteLoadingIndicator from "./infinite-loading-indicator";

interface ExploreCanvasProps {
  categories?: string[];
  filters?: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  };
}

const ExploreCanvas = ({
  categories = [],
  filters = {},
}: ExploreCanvasProps) => {
  const {
    assets,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    loadMore,
    isEmpty,
    canLoadMore,
  } = useInfiniteExploreAssets({
    categories,
    filters,
    limit: 12,
  });

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasNextPage,
    isLoadingMore,
    threshold: 200,
    enabled: true,
  });

  if (isLoading && assets.length === 0) {
    return <ExploreCardSkeletonGrid />;
  }

  if (error && assets.length === 0) {
    return (
      <section className="flex w-full flex-col items-center justify-center py-20">
        <div className="text-center">
          <p className="font-bricolage mb-4 text-gray-500">
            Failed to load assets: {error}
          </p>
          <button
            onClick={() => window.location.reload()}
            className="button_base px-4 py-2"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  if (isEmpty) {
    return (
      <section className="flex w-full flex-col items-center justify-center py-20">
        <div className="text-center"></div>
      </section>
    );
  } 

  return (
    <section className="flex w-full flex-col items-center justify-center">
      <div className="grid grid-cols-1 gap-5 space-y-[50px] md:grid-cols-2 lg:grid-cols-3">
        {assets.map((item: TAsset, index: number) => (
          <div
            key={item.fileId}
            className="motion-preset-expand motion-duration-700"
            style={{
              animationDelay: `${Math.min(index, 20) * 50}ms`,
            }}
          >
            <ExploreCard
              id={item.fileId}
              artWork={item.url}
              artName={item.fileName}
              artistImage={item.imageUrl}
              artistName={`${item.firstName} ${item.lastName}`}
              likeCount={item.numOfLikes}
            />
          </div>
        ))}
      </div>

      {isLoadingMore && <InfiniteLoadingIndicator className="mt-8" />}

      {/* Sentinel element for intersection observer */}
      {canLoadMore && (
        <div
          ref={sentinelRef}
          className="mt-8 flex h-10 w-full items-center justify-center"
        />
      )}

      {/* End of results indicator */}
      {!hasNextPage && assets.length > 0 && (
        <div className="mt-8 w-full py-8 text-center">
          <p className="font-bricolage text-sm text-gray-400">
            You've reached the end of the gallery
          </p>
        </div>
      )}
    </section>
  );
};

export default ExploreCanvas;
