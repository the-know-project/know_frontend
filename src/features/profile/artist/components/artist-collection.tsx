import { IconCirclePlus } from "@tabler/icons-react";
import Collections from "./collections";
import { useSimpleInfiniteArtistCollections } from "../hooks/use-fetch-artist-collections";
import { useInfiniteScroll } from "@/src/features/explore/hooks/use-infinite-scroll";
import { showLog } from "@/src/utils/logger";
import InfiniteLoadingIndicator from "@/src/features/explore/components/infinite-loading-indicator";
import CollectionCardSkeleton from "@/src/features/collection/components/collection-card-skeleton";
import ProfileCardSkeletonGrid from "../../layout/profile-card-skeleton";

const ArtistCollection = () => {
  const collectionHookResult = useSimpleInfiniteArtistCollections({});

  const infiniteScrollResult = useInfiniteScroll({
    onLoadMore: collectionHookResult.loadMore,
    hasNextPage: collectionHookResult.hasNextPage,
    isLoadingMore: collectionHookResult.isLoadingMore,
    threshold: 200,
    enabled: true,
  });

  const { sentinelRef } = infiniteScrollResult;
  const {
    collections,
    isLoading,
    isLoadingMore,
    error,
    isEmpty,
    canLoadMore,
    hasNextPage,
  } = collectionHookResult;

  showLog({
    context: "Collections",
    data: collections,
  });

  if (isLoading && collections.length === 0) {
    return (
      <section className="relative -mt-[50px] flex min-h-screen w-full flex-col items-center justify-center space-y-3">
        <ProfileCardSkeletonGrid />
      </section>
    );
  }

  if (error && collections.length === 0) {
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
    <section className="relative -mt-[50px] flex min-h-screen w-full flex-col">
      <div className="overflow-x-hidden">
        <Collections collections={collections} />
      </div>
      <div className="sticky bottom-5 z-50 w-fit self-end">
        <div className="rounded-3xl bg-transparent p-2 shadow-lg backdrop-blur-2xl">
          <IconCirclePlus
            width={50}
            height={50}
            className="text-neutral-600 transition-all duration-300 hover:text-blue-800"
          />
        </div>
      </div>

      <div className="fixed bottom-0 self-center">
        {isLoadingMore && <InfiniteLoadingIndicator className="mt-8" />}
        {canLoadMore && (
          <div
            ref={sentinelRef}
            className="mt-8 flex h-10 w-full items-center justify-center"
          />
        )}
        {!hasNextPage && collections.length > 0 && (
          <div className="mt-8 w-full py-8 text-center">
            <p className="font-bricolage text-sm text-gray-400">
              You've reached the end of the collections
            </p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ArtistCollection;
