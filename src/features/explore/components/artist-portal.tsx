"use client";

import { BlankProfilePicture } from "@/src/constants/constants";
import { useArtistContent } from "../hooks/use-artist-content";
import { useEffect, useRef, useState } from "react";
import { X, RefreshCw } from "lucide-react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Folder, Heart, Image as ImageIcon } from "lucide-react";
import ProfileCard from "@/src/features/profile/components/profile-card";
import { useToggleExploreContent } from "../state/explore-content.store";

interface Props {
  artistId: string;
  onClose: () => void;
}

export default function ArtistPortal({ artistId, onClose }: Props) {
  const [tab, setTab] = useState<"posts" | "collections">("posts");
  const [mounted, setMounted] = useState(false);
  const posts = useArtistContent(artistId, "posts", true);
  const collections = useArtistContent(
    artistId,
    "collections",
    tab === "collections",
  );
  const active = tab === "posts" ? posts : collections;
  const sentinel = useRef<HTMLDivElement>(null);
  const toggleExploreContent = useToggleExploreContent();
  const profile =
    posts.data?.pages[0]?.data.profile ??
    collections.data?.pages[0]?.data.profile;
  const items = active.data?.pages.flatMap((page) => page.data.items) ?? [];

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", keydown);
    return () => {
      document.body.style.overflow = oldOverflow;
      document.removeEventListener("keydown", keydown);
    };
  }, [onClose]);

  useEffect(() => {
    const node = sentinel.current;
    if (!node || !active.hasNextPage || active.isFetchingNextPage) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void active.fetchNextPage();
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [
    active.hasNextPage,
    active.isFetchingNextPage,
    active.fetchNextPage,
    tab,
  ]);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget) onClose();
        }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-label="Artist profile"
          className="flex h-[90vh] max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-[0_24px_100px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.98 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <header className="relative flex min-h-0 shrink-0 basis-[30%] flex-col items-center overflow-y-auto border-b px-6 pt-5 pb-4 text-center sm:pt-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Close artist profile"
              className="absolute top-4 right-4 rounded-full p-2 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
            <Image
              src={profile?.imageUrl || BlankProfilePicture}
              alt=""
              width={88}
              height={88}
              className="h-22 w-22 rounded-full object-cover"
            />
            <h2 className="mt-3 text-xl font-bold text-neutral-900 capitalize">
              {profile
                ? `${profile.firstName ?? ""} ${profile.lastName ?? ""}`.trim() ||
                  profile.username ||
                  "Artist"
                : "Artist profile"}
            </h2>
            {profile?.username && (
              <p className="text-sm text-neutral-500">@{profile.username}</p>
            )}
            {profile?.description && (
              <p className="font-grotesk mt-2 max-w-2xl text-sm text-neutral-600">
                {profile.description}
              </p>
            )}
            <div className="font-grotesk mt-4 flex items-center justify-center gap-8 text-center">
              <div>
                <p className="text-base font-semibold text-neutral-900">
                  {profile?.followerCount ?? 0}
                </p>
                <p className="text-xs text-neutral-500">Followers</p>
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-900">
                  {profile?.assetCount ?? 0}
                </p>
                <p className="text-xs text-neutral-500">Artworks</p>
              </div>
              <div>
                <p className="text-base font-semibold text-neutral-900">
                  {profile?.collectionCount ?? 0}
                </p>
                <p className="text-xs text-neutral-500">Collections</p>
              </div>
            </div>
          </header>
          <div
            role="tablist"
            aria-label="Artist content"
            className="flex shrink-0 border-b"
          >
            {(["posts", "collections"] as const).map((value) => (
              <button
                key={value}
                type="button"
                role="tab"
                aria-selected={tab === value}
                onClick={() => setTab(value)}
                className={`font-bebas flex-1 py-3 text-sm font-bold tracking-wider capitalize ${tab === value ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-500"}`}
              >
                {value}
              </button>
            ))}
          </div>
          <div className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6">
            {active.isLoading ? (
              <div className="py-16 text-center text-sm text-neutral-500">
                Loading {tab}…
              </div>
            ) : active.isError ? (
              <div className="py-16 text-center">
                <p className="text-sm text-red-600">Couldn’t load {tab}.</p>
                <button
                  type="button"
                  onClick={() => void active.refetch()}
                  className="mt-3 inline-flex items-center gap-2 text-sm underline"
                >
                  <RefreshCw className="h-4 w-4" /> Try again
                </button>
              </div>
            ) : items.length === 0 ? (
              <div className="py-16 text-center text-sm text-neutral-500">
                No {tab} yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                {items.map((item, index) =>
                  tab === "posts" ? (
                    <ProfileCard
                      key={item.fileId}
                      id={item.fileId}
                      title={item.name}
                      views={item.numOfViews ?? 0}
                      createdAt={new Date(item.createdAt).toLocaleDateString()}
                      image={item.url}
                      isListed={Boolean(item.isListed)}
                      showEditControls={false}
                      onClick={() => {
                        onClose();
                        toggleExploreContent(item.fileId, {
                          id: item.fileId,
                          userId: artistId,
                          creatorProfileUrl:
                            profile?.imageUrl || BlankProfilePicture,
                          creatorName:
                            `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim(),
                          artName: item.name,
                          description: item.description,
                          artWorkUrl: item.url,
                          highResUrl: item.highResUrl || item.url,
                          extraUrls: item.extraUrls || [],
                          highResExtraUrls: item.extraUrls || [],
                          categories: item.categories || [],
                          tags: item.tags || [],
                          price: Number(item.price) || 0,
                          size: item.size || {},
                          numOfLikes: item.numOfLikes || 0,
                          numOfViews: item.numOfViews || 0,
                          numOfComments: 0,
                          isListed: Boolean(item.isListed),
                          createdAt: new Date(item.createdAt),
                        });
                      }}
                    />
                  ) : (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        duration: 0.25,
                        delay: Math.min(index * 0.04, 0.2),
                      }}
                    >
                      <Link
                        href={`/collections/${item.id}`}
                        className="group block overflow-hidden rounded-xl border border-neutral-200 bg-neutral-100 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
                      >
                        <div className="flex aspect-[4/3] items-center justify-center bg-neutral-200 text-neutral-400 transition group-hover:bg-neutral-300">
                          <Folder className="h-20 w-20" strokeWidth={1.1} />
                        </div>
                        <div className="p-4">
                          <h3 className="font-semibold text-neutral-900">
                            {item.title}
                          </h3>
                          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500">
                            <span className="inline-flex items-center gap-1">
                              <ImageIcon className="h-3.5 w-3.5" />
                              {item.assetCount ?? item.numOfArt ?? 0} assets
                            </span>
                            <span>
                              {new Date(item.createdAt).toLocaleDateString()}
                            </span>
                            <span className="inline-flex items-center gap-1">
                              <Heart className="h-3.5 w-3.5" />
                              {item.likeCount ?? 0}
                            </span>
                          </div>
                        </div>
                      </Link>
                    </motion.div>
                  ),
                )}
              </div>
            )}
            {active.isFetchingNextPage && (
              <p className="py-5 text-center text-sm text-neutral-500">
                Loading more…
              </p>
            )}
            {active.hasNextPage && !active.isError && (
              <div ref={sentinel} className="h-4" />
            )}
          </div>
        </motion.section>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
