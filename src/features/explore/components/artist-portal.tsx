"use client";

import { BlankProfilePicture } from "@/src/constants/constants";
import { useArtistContent } from "../hooks/use-artist-content";
import { useEffect, useRef, useState } from "react";
import { X, RefreshCw } from "lucide-react";
import Image from "next/image";
import ProfileCard from "@/src/features/profile/components/profile-card";
import { useToggleExploreContent } from "../state/explore-content.store";

interface Props {
  artistId: string;
  onClose: () => void;
}

export default function ArtistPortal({ artistId, onClose }: Props) {
  const [tab, setTab] = useState<"posts" | "collections">("posts");
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

  return (
    <div
      className="fixed inset-0 z-[110] flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="Artist profile"
        className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <header className="relative flex shrink-0 flex-col items-center border-b px-6 pt-8 pb-5 text-center">
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
          <h2 className="mt-3 text-xl font-semibold text-neutral-900">
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
            <p className="mt-2 max-w-2xl text-sm text-neutral-600">
              {profile.description}
            </p>
          )}
          <p className="mt-2 text-xs text-neutral-500">
            {profile?.followerCount ?? 0} followers
          </p>
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
              className={`flex-1 py-3 text-sm font-medium capitalize ${tab === value ? "border-b-2 border-neutral-900 text-neutral-900" : "text-neutral-500"}`}
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
                    onClick={() =>
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
                      })
                    }
                  />
                ) : (
                  <article
                    key={item.id}
                    className="overflow-hidden rounded-xl border border-neutral-200"
                  >
                    <Image
                      src={
                        item.imageUrl || item.bannerUrl || BlankProfilePicture
                      }
                      alt={item.title}
                      width={640}
                      height={480}
                      className="aspect-[4/3] w-full object-cover"
                    />
                    <div className="p-3">
                      <h3 className="font-semibold text-neutral-900">
                        {item.title}
                      </h3>
                      <p className="mt-1 line-clamp-2 text-sm text-neutral-500">
                        {item.description}
                      </p>
                    </div>
                  </article>
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
      </section>
    </div>
  );
}
