"use client";

import ExploreCard from "./explore-card";
import { useFetchExploreAsset } from "../hooks/use-fetch-explore-asset";
import { ExploreCardSkeletonGrid } from "./explore-card-skeleton";
import { TAsset } from "../types/explore.types";

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
  const { data, isLoading } = useFetchExploreAsset({
    categories: categories.length > 0 ? categories : undefined,
    ...filters,
  });

  if (isLoading) {
    return <ExploreCardSkeletonGrid />;
  }

  const assets = data?.data.assets ? data.data.assets : [];
  return (
    <section className="flex w-full flex-col items-center justify-center">
      <div className="grid grid-cols-1 gap-5 space-y-[50px] md:grid-cols-2 lg:grid-cols-3">
        {assets.map((item: TAsset, index: number) => (
          <div
            key={item.fileId}
            className="motion-preset-expand motion-duration-700"
            style={{
              animationDelay: `${index * 100}ms`,
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
    </section>
  );
};

export default ExploreCanvas;
