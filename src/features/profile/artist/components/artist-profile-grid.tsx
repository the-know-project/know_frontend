"use client";

import { ArtistProfileToggle } from "@/src/constants/constants";
import { formatDateToReadable } from "@/src/utils/date";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect, type KeyboardEvent } from "react";
import { createPortal } from "react-dom";
import {
  Folder,
  Heart,
  Image as ImageIcon,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import InfiniteLoadingIndicator from "../../../explore/components/infinite-loading-indicator";
import { useInfiniteScroll } from "../../../explore/hooks/use-infinite-scroll";
import ProfileCard from "../../components/profile-card";
import { TUserAssetData } from "../dto/artist.dto";
import { useSimpleInfiniteUserPosts } from "../hooks/use-fetch-user-posts";
import { IUser } from "@/src/features/auth/state/interface/auth.interface";
import Stats from "./artist-stats";
import ProfileCardSkeletonGrid from "../../layout/profile-card-skeleton";
import { useCanFetchData } from "@/src/features/auth/hooks/use-optimized-auth";
import ArtDetails from "@/src/shared/components/art-details";
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { useToggleExploreContent } from "@/src/features/explore/state/explore-content.store";
import UploadCanvas from "@/src/features/upload/components/upload-canvas";
import { useArtistCollections } from "@/src/features/collections/hooks/use-artist-collections";
import CollectionPickerDialog from "@/src/features/collections/components/collection-picker-dialog";
import type { CollectionOverview } from "@/src/features/collections/types/collection.types";
import { useDeleteCollection } from "@/src/features/collections/hooks/use-delete-collection";

interface ArtistProfileGridProps {
  user: IUser;
}

const ArtistProfileGrid = ({ user }: ArtistProfileGridProps) => {
  const canFetch = useCanFetchData();
  const [activeToggle, setActiveToggle] = useState<string>("posts");
  const [mounted, setMounted] = useState(false);
  const tabRefs = useRef(new Map<string, HTMLButtonElement>());
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
  const [editingPost, setEditingPost] = useState<TUserAssetData | null>(null);
  const [collectionAssetId, setCollectionAssetId] = useState<string | null>(
    null,
  );
  const [openCollectionMenu, setOpenCollectionMenu] = useState<string | null>(
    null,
  );
  const [deleteErrorId, setDeleteErrorId] = useState<string | null>(null);
  const deleteCollection = useDeleteCollection();

  const toggleExploreContent = useToggleExploreContent();

  useEffect(() => setMounted(true), []);

  const handleOpenArtDetails = (post: TUserAssetData) => {
    const content: IExploreContent = {
      id: post.fileId,
      userId: user.id,
      creatorProfileUrl: user.imageUrl,
      creatorName:
        `${post.firstName || user.firstName} ${post.lastName || ""}`.trim(),
      artName: post.name,
      description: post.description ?? null,
      artWorkUrl: post.url,
      highResUrl: post.highResUrl || post.url,
      extraUrls: post.extraUrls || [],
      highResExtraUrls: post.highResExtraUrls || [],
      categories: post.categories,
      tags: post.tags,
      price: post.price,
      quantity: post.quantity,
      size: {
        width: post.size.width,
        height: post.size.height,
        depth: post.size.depth,
        diameter: post.size.diameter,
        length: post.size.length,
        aspectRatio: post.size.aspectRatio,
        weight: post.size.weight,
        weightUnit: post.size.weightUnit,
        dimensionUnit: post.size.dimensionUnit,
      },
      numOfLikes: post.numOfLikes,
      numOfViews: post.numOfViews,
      numOfComments: 0,
      isListed: post.isListed,
      createdAt: post.createdAt,
    };

    const viewportPosition = {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
    };

    toggleExploreContent(post.fileId, content, viewportPosition);
  };

  useEffect(() => {
    const activeTabElement = tabRefs.current.get(activeToggle);
    if (activeTabElement) {
      setIndicatorStyle({
        left: activeTabElement.offsetLeft,
        width: activeTabElement.offsetWidth,
      });
    }
  }, [activeToggle]);

  const postsHookResult = useSimpleInfiniteUserPosts({
    userId: user.id,
    limit: 12,
  });
  const collectionsHookResult = useArtistCollections(
    user.id,
    canFetch && activeToggle === "collections",
  );

  const infiniteScrollResult = useInfiniteScroll({
    onLoadMore: postsHookResult.loadMore,
    hasNextPage: postsHookResult.hasNextPage,
    isLoadingMore: postsHookResult.isLoadingMore,
    threshold: 200,
    enabled: activeToggle === "posts",
  });
  const collectionsScroll = useInfiniteScroll({
    onLoadMore: () => collectionsHookResult.fetchNextPage(),
    hasNextPage: Boolean(collectionsHookResult.hasNextPage),
    isLoadingMore: collectionsHookResult.isFetchingNextPage,
    threshold: 200,
    enabled: activeToggle === "collections",
  });

  const {
    posts,
    isLoading,
    isLoadingMore,
    hasNextPage,
    error,
    isEmpty,
    canLoadMore,
  } = postsHookResult;

  const { sentinelRef } = infiniteScrollResult;
  const collections =
    collectionsHookResult.data?.pages.flatMap((page) => page.data.items) ?? [];

  const variants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0 },
  };

  const handleTabKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentTab: string,
  ) => {
    const currentIndex = ArtistProfileToggle.findIndex(
      (toggle) => toggle.name === currentTab,
    );
    let nextIndex = currentIndex;

    if (event.key === "ArrowRight")
      nextIndex = (currentIndex + 1) % ArtistProfileToggle.length;
    else if (event.key === "ArrowLeft")
      nextIndex =
        (currentIndex - 1 + ArtistProfileToggle.length) %
        ArtistProfileToggle.length;
    else if (event.key === "Home") nextIndex = 0;
    else if (event.key === "End") nextIndex = ArtistProfileToggle.length - 1;
    else return;

    event.preventDefault();
    const nextTab = ArtistProfileToggle[nextIndex].name;
    setActiveToggle(nextTab);
    tabRefs.current.get(nextTab)?.focus();
  };

  const renderPostsContent = () => {
    if (!canFetch || isLoading) {
      return <ProfileCardSkeletonGrid />;
    }

    if (error && posts.length === 0) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="text-center">
            <p className="font-bricolage mb-4 text-gray-500">
              Failed to load posts: {error}
            </p>
            <button
              type="button"
              onClick={() => void postsHookResult.refetch()}
              className="button_base inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="col-span-full flex flex-col items-center justify-center py-20">
          <div className="flex flex-col items-center text-center">
            <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
              <ImageIcon aria-hidden="true" className="h-6 w-6" />
            </span>
            <p className="font-bebas text-lg font-semibold tracking-wider text-neutral-800">
              No posts yet
            </p>
            <p className="font-grotesk mt-1 max-w-xs text-sm leading-6 text-neutral-500">
              Artwork shared by this artist will appear here.
            </p>
          </div>
        </div>
      );
    }

    return (
      <>
        <AnimatePresence>
          {posts.map((post: TUserAssetData, index: number) => (
            <motion.div
              key={post.fileId}
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: Math.min(index, 10) * 0.035,
                ease: "easeOut",
                duration: 0.22,
              }}
              className="w-full min-w-0"
            >
              <ProfileCard
                id={post.fileId}
                title={post.name}
                views={post.numOfViews}
                createdAt={formatDateToReadable(post.createdAt.toString())}
                image={post.highResUrl || post.url}
                role={user.role as string}
                isListed={post.isListed}
                onClick={() => handleOpenArtDetails(post)}
                onEditPost={() => setEditingPost(post)}
                onAddToCollection={() => setCollectionAssetId(post.fileId)}
              />
            </motion.div>
          ))}
        </AnimatePresence>

        {isLoadingMore && (
          <div className="col-span-full flex w-full justify-center py-4">
            <InfiniteLoadingIndicator />
          </div>
        )}

        {/* Sentinel element for intersection observer */}
        {canLoadMore && (
          <div
            ref={sentinelRef}
            aria-hidden="true"
            className="col-span-full h-6 w-full"
          />
        )}

        {!hasNextPage && posts.length > 0 && (
          <div className="col-span-full w-full border-t border-neutral-200 pt-4 text-center">
            <p className="font-bebas text-sm tracking-wider text-neutral-600">
              You've reached the end of the posts
            </p>
          </div>
        )}
      </>
    );
  };

  return (
    <section className="-mt-8 flex w-full flex-col px-3 sm:px-5 md:-mt-10 md:px-6 lg:px-8">
      {editingPost && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-white">
          <UploadCanvas
            key={editingPost.fileId}
            mode="edit"
            asset={editingPost}
            onCancel={() => setEditingPost(null)}
            onComplete={() => setEditingPost(null)}
          />
        </div>
      )}
      {collectionAssetId && (
        <CollectionPickerDialog
          artistId={user.id}
          fileId={collectionAssetId}
          onClose={() => setCollectionAssetId(null)}
        />
      )}
      <ArtDetails />
      <div className="w-full items-center justify-center">
        <div
          role="tablist"
          aria-label="Artist profile sections"
          className="relative flex flex-row items-center justify-between"
        >
          {ArtistProfileToggle.map((toggle) => (
            <button
              key={toggle.id}
              ref={(el) => {
                if (el) tabRefs.current.set(toggle.name, el);
              }}
              type="button"
              role="tab"
              aria-selected={activeToggle === toggle.name}
              tabIndex={activeToggle === toggle.name ? 0 : -1}
              aria-controls="artist-profile-panel"
              className="flex min-h-12 flex-1 flex-col items-center justify-center rounded-t-xl transition-colors hover:bg-neutral-50 focus-visible:ring-2 focus-visible:ring-neutral-500 focus-visible:outline-none focus-visible:ring-inset"
              onClick={() => setActiveToggle(toggle.name)}
              onKeyDown={(event) => handleTabKeyDown(event, toggle.name)}
            >
              <p
                className={`font-bebas text-[15px] capitalize sm:text-base lg:text-[18px] ${
                  activeToggle === toggle.name
                    ? "font-semibold text-neutral-900 transition-colors duration-300"
                    : "text-neutral-500"
                }`}
              >
                {toggle.name}
              </p>
            </button>
          ))}
          {/* Continuous line background */}
          <div
            aria-hidden="true"
            className="absolute right-0 bottom-0 left-0 h-[2px] bg-gray-200"
          ></div>
          {/* Active section highlight */}
          <div
            aria-hidden="true"
            className="absolute bottom-0 h-[2px] rounded-full bg-gray-900 transition-all duration-300"
            style={{ left: indicatorStyle.left, width: indicatorStyle.width }}
          ></div>
        </div>
      </div>
      <div
        id="artist-profile-panel"
        role="tabpanel"
        tabIndex={0}
        aria-label={`${activeToggle} content`}
        className="mt-4 grid min-h-screen w-full content-start grid-cols-1 items-start gap-y-6 bg-white pb-16 md:grid-cols-2 md:gap-x-5 md:gap-y-8 lg:gap-x-7"
      >
        {activeToggle === "posts" && renderPostsContent()}
        {activeToggle === "stats" && (
          <div className="col-span-full flex w-full flex-col items-center justify-center">
            <Stats />
          </div>
        )}
        {activeToggle === "collections" &&
          (!canFetch || collectionsHookResult.isLoading) && (
            <div className="col-span-full">
              <ProfileCardSkeletonGrid />
            </div>
          )}
        {activeToggle === "collections" && collectionsHookResult.isError && (
          <div className="col-span-full flex flex-col items-center justify-center py-20">
            <p className="mb-4 text-gray-500">Failed to load collections.</p>
            <button
              type="button"
              onClick={() => void collectionsHookResult.refetch()}
              className="button_base inline-flex min-h-11 items-center gap-2 rounded-xl px-4 py-2"
            >
              <RefreshCw className="h-4 w-4" />
              Try Again
            </button>
          </div>
        )}
        {activeToggle === "collections" &&
          canFetch &&
          !collectionsHookResult.isLoading &&
          !collectionsHookResult.isError &&
          collections.length === 0 && (
            <div className="col-span-full flex flex-col items-center justify-center py-20">
              <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-neutral-100 text-neutral-500">
                <Folder aria-hidden="true" className="h-8 w-8" />
              </span>
              <p className="font-bebas text-lg font-semibold tracking-wider text-neutral-800">
                No collections yet
              </p>
              <p className="font-grotesk mt-1 max-w-xs text-center text-sm leading-6 text-neutral-500">
                Collections created by this artist will appear here.
              </p>
            </div>
          )}
        {activeToggle === "collections" &&
          canFetch &&
          !collectionsHookResult.isLoading &&
          !collectionsHookResult.isError &&
          collections.map((collection: CollectionOverview, index: number) => (
            <motion.article
              key={collection.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.24,
                delay: Math.min(index, 10) * 0.035,
              }}
              className="relative w-full min-w-0"
            >
              <Link
                href={`/collections/${collection.id}`}
                className="group block overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="flex aspect-[4/3] items-center justify-center bg-neutral-200 text-neutral-400 transition group-hover:bg-neutral-300">
                  <Folder className="h-20 w-20" strokeWidth={1.1} />
                </div>
                <div className="p-4">
                  <h3 className="font-helvetica font-semibold text-neutral-900 capitalize">
                    {collection.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                    <span className="font-grotesk inline-flex items-center gap-1 capitalize">
                      <ImageIcon className="h-3.5 w-3.5" />
                      {collection.assetCount ?? 0} assets
                    </span>
                    <span className="font-grotesk capitalize">
                      {formatDateToReadable(collection.createdAt)}
                    </span>
                    <span className="font-grotesk inline-flex items-center gap-1">
                      <Heart className="h-3.5 w-3.5" />
                      {collection.likeCount ?? 0}
                    </span>
                  </div>
                </div>
              </Link>
              <div className="absolute top-3 right-3 z-10">
                <button
                  type="button"
                  aria-label={`Collection actions for ${collection.title}`}
                  aria-expanded={openCollectionMenu === collection.id}
                  onClick={() => {
                    setDeleteErrorId(null);
                    setOpenCollectionMenu((current) =>
                      current === collection.id ? null : collection.id,
                    );
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-full border border-white bg-neutral-500 text-white shadow backdrop-blur transition"
                >
                  <MoreHorizontal className="h-5 w-5" />
                </button>
                {openCollectionMenu === collection.id && (
                  <div className="absolute top-12 right-0 min-w-40 rounded-xl border border-neutral-200 bg-neutral-50 p-1.5 shadow-xl">
                    <button
                      type="button"
                      disabled={deleteCollection.isPending}
                      onClick={() => {
                        if (
                          !window.confirm(
                            `Delete “${collection.title}”? This cannot be undone.`,
                          )
                        )
                          return;
                        setDeleteErrorId(null);
                        deleteCollection.mutate(
                          { collectionId: collection.id },
                          {
                            onSuccess: () => setOpenCollectionMenu(null),
                            onError: () => setDeleteErrorId(collection.id),
                          },
                        );
                      }}
                      className="flex min-h-10 w-full items-center gap-2 rounded-lg px-3 text-left text-sm text-red-600 transition hover:bg-red-50 disabled:opacity-60"
                    >
                      <Trash2 className="h-4 w-4" />
                      {deleteCollection.isPending &&
                      deleteCollection.variables?.collectionId === collection.id
                        ? "Deleting…"
                        : "Delete"}
                    </button>
                  </div>
                )}
              </div>
              {deleteErrorId === collection.id && (
                <p role="alert" className="mt-2 text-sm text-red-600">
                  Could not delete this collection. Please try again.
                </p>
              )}
            </motion.article>
          ))}
        {activeToggle === "collections" &&
          collectionsHookResult.isFetchingNextPage && (
            <div className="col-span-full flex justify-center py-4">
              <InfiniteLoadingIndicator />
            </div>
          )}
        {activeToggle === "collections" &&
          collectionsHookResult.hasNextPage && (
            <div
              ref={collectionsScroll.sentinelRef}
              aria-hidden="true"
              className="col-span-full h-6 w-full"
            />
          )}
      </div>
      {mounted &&
        (activeToggle === "posts" || activeToggle === "collections") &&
        canFetch &&
        createPortal(
          <Link
            href={activeToggle === "posts" ? "/upload" : "/collections/new"}
            aria-label={
              activeToggle === "posts"
                ? "Upload an artwork"
                : "Create a collection"
            }
            title={
              activeToggle === "posts"
                ? "Upload an artwork"
                : "Create a collection"
            }
            className="fixed right-6 bottom-[calc(1.5rem+env(safe-area-inset-bottom))] z-[120] flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3A8A] text-white shadow-xl transition hover:scale-105 focus-visible:ring-4 focus-visible:ring-indigo-300 focus-visible:outline-none"
          >
            <Plus className="h-7 w-7" aria-hidden="true" />
          </Link>,
          document.body,
        )}
    </section>
  );
};

export default ArtistProfileGrid;
