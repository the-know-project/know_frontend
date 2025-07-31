"use client";

import ArtDetails from "@/src/shared/components/art-details";
import { AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef } from "react";
import { useEnhancedAuthContext } from "../../auth/components/enhanced-auth-provider";
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
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";

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

const AuthLoadingState = ({ message = "Loading..." }: { message?: string }) => (
  <section className="flex w-full flex-col items-center justify-center py-20">
    <div className="text-center">
      <div className="mb-4">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-gray-300 border-t-blue-600"></div>
      </div>
      <p className="font-bricolage text-sm text-gray-600">{message}</p>
    </div>
  </section>
);

const useAuthCheck = () => {
  const router = useRouter();
  const hasRedirected = useRef(false);
  const { isAuthenticated, isTokenExpired, tokenInfo, error } =
    useEnhancedAuthContext();

  const hasCriticalError = useMemo(() => {
    return (
      !isAuthenticated &&
      error &&
      (error.includes("No authentication token") ||
        error.includes("refresh_token_invalid") ||
        error.includes("Session expired"))
    );
  }, [isAuthenticated, error]);

  const hasRefreshToken = useMemo(() => {
    return tokenInfo?.hasRefreshToken || false;
  }, [tokenInfo?.hasRefreshToken]);

  useEffect(() => {
    if (hasCriticalError && !hasRedirected.current) {
      hasRedirected.current = true;
      router.push("/login");
    }
  }, [hasCriticalError, router]);

  return useMemo(() => {
    if (hasCriticalError) {
      return { isValid: false, shouldRedirect: true };
    }

    // If token is expired but we have a refresh token, consider it valid
    // The enhanced system will handle the refresh automatically
    if (isTokenExpired && hasRefreshToken) {
      return { isValid: true, shouldRedirect: false };
    }

    return { isValid: isAuthenticated, shouldRedirect: false };
  }, [isAuthenticated, isTokenExpired, hasRefreshToken, hasCriticalError]);
};

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
  const toggleExploreContent = useToggleExploreContent();
  console.log(
    `is content toggled: ${isExploreContentToggled} : ${toggledContentId}`,
  );

  // ESC key handler to close popup
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent) => {
      if (
        event.key === "Escape" &&
        isExploreContentToggled &&
        toggledContentId
      ) {
        toggleExploreContent(
          toggledContentId,
          exploreContent as IExploreContent,
        );
      }
    };

    if (isExploreContentToggled) {
      document.addEventListener("keydown", handleEscKey);
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

  if (isLoading && assets.length === 0 && isCartLoading) {
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
      <AnimatePresence>
        {isExploreContentToggled && <ArtDetails />}
      </AnimatePresence>
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
                description={item.description}
                artistImage={item.imageUrl}
                artistName={`${item.firstName} ${item.lastName}`}
                likeCount={item.numOfLikes}
                isListed={item.isListed}
                role={role!}
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
  const authCheck = useAuthCheck();

  if (!authCheck.isValid) {
    if (authCheck.shouldRedirect) {
      return (
        <AuthLoadingState message="Session expired, redirecting to login..." />
      );
    }

    return (
      <section className="flex w-full flex-col items-center justify-center py-20">
        <div className="text-center">
          <p className="font-bricolage mb-4 text-gray-500">
            Please log in to view content
          </p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="button_base px-4 py-2"
          >
            Go to Login
          </button>
        </div>
      </section>
    );
  }

  return <ExploreCanvasContent {...props} />;
};

export default ExploreCanvas;
