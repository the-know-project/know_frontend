"use client";

import ArtDetails from "@/src/shared/components/art-details";
import { useEffect } from "react";
import { useBulkCartActions } from "../../cart/hooks/use-cart";
import { useFetchUserCart } from "../../cart/hooks/use-fetch-user-cart";
import { TCart } from "../../cart/types/cart.types";
import { useInfiniteScroll } from "../hooks/use-infinite-scroll";
import { useSimpleInfiniteAssets } from "../hooks/use-simple-infinite-assets";
import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "../state/explore-content.store";
import { TAsset } from "../types/explore.types";
import ExploreCard from "./explore-card";
import { ExploreCardSkeletonGrid } from "./explore-card-skeleton";
import InfiniteLoadingIndicator from "./infinite-loading-indicator";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";
import { useFetchUserFollowing } from "../../metrics/hooks/use-fetch-user-following";
import { showLog } from "@/src/utils/logger";

interface ExploreCanvasProps {
  categories?: string[];
  filters?: {
    priceMin?: number;
    priceMax?: number;
    sortBy?: "latest" | "oldest";
    available?: boolean;
  };
  isInitialized?: boolean;
}

const ExploreCanvasContent = ({
  categories = [],
  filters = {},
}: ExploreCanvasProps) => {
  const assetsHookResult = useSimpleInfiniteAssets({
    categories,
    filters,
    limit: 12,
  });

  const { isExploreContentToggled, toggledContentId, exploreContent } =
    useIsExploreContentToggled();
  const { following } = useFetchUserFollowing({
    limit: 20,
  });
  const toggleExploreContent = useToggleExploreContent();

  showLog({
    context: "Explore Canvas",
    data: `is content toggled: ${isExploreContentToggled} : ${toggledContentId}`,
  });

  showLog({
    context: "Explore Canvas: User Following",
    data: following,
  });

  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        isExploreContentToggled &&
        toggledContentId
      ) {
        toggleExploreContent(toggledContentId, exploreContent);
      }
    };

    if (isExploreContentToggled) {
      document.addEventListener("keydown", handleEscKey);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.removeEventListener("keydown", handleEscKey);
    };
  }, [isExploreContentToggled, toggledContentId, toggleExploreContent]);

  const cartActions = useBulkCartActions();
  const cartData = useFetchUserCart();

  const infiniteScrollResult = useInfiniteScroll({
    onLoadMore: assetsHookResult.loadMore,
    hasNextPage: assetsHookResult.hasNextPage,
    isLoadingMore: assetsHookResult.isLoadingMore,
    threshold: 200,
    enabled: true,
  });

  const {
    assets,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    isEmpty,
    canLoadMore,
    role,
  } = assetsHookResult;

  const { initCart } = cartActions;
  const { isLoading: isCartLoading, data: cartDataResult } = cartData;
  const { sentinelRef } = infiniteScrollResult;

  useEffect(() => {
    if (
      !isCartLoading &&
      cartDataResult &&
      typeof cartDataResult === "object" &&
      !Array.isArray(cartDataResult) &&
      "data" in cartDataResult &&
      cartDataResult.data
    ) {
      const transformedCartData = cartDataResult.data.map((item: TCart) => ({
        fileId: item.fileId,
        quantity: item.quantity,
      }));

      initCart(transformedCartData);
    }
  }, [isCartLoading, cartDataResult, initCart]);

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
    <section className="relative flex w-full flex-col items-center">
      {isExploreContentToggled && <ArtDetails />}
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
                userId={item.userId}
                artWork={item.url}
                highResUrl={item.highResUrl}
                artName={item.fileName}
                description={item.description}
                artistImage={item.imageUrl}
                artistName={`${item.firstName} ${item.lastName}`}
                likeCount={item.numOfLikes}
                isListed={item.isListed}
                role={role!}
                categories={item.categories}
                tags={item.tags}
                price={item.price}
                size={item.size}
                numOfViews={item.numOfViews}
                createdAt={item.createdAt}
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

        {!hasNextPage && assets.length > 0 && (
          <div className="mt-8 w-full py-8 text-center">
            <p className="font-bricolage text-sm text-gray-400">
              You've reached the end of the gallery
            </p>
          </div>
        )}
      </section>
    </section>
  );
};

const ExploreCanvas = (props: ExploreCanvasProps) => {
  const canFetch = useCanFetchData();

  if (!canFetch) {
    return <ExploreCardSkeletonGrid />;
  }
  return <ExploreCanvasContent {...props} />;
};

export default ExploreCanvas;
