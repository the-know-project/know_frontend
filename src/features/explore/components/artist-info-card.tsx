"use client";

import Link from "next/link";
import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import ExploreFollowButton from "./explore-follow-button";
import { useArtistInfo } from "../hooks/use-artist-info";
import { useOpenArtistPortal } from "../hooks/use-open-artist-portal";

interface ArtistInfoCardProps {
  artistId: string;
  artistName?: string;
  artistImage?: string;
}

const ArtistInfoCard = ({
  artistId,
  artistName,
  artistImage,
}: ArtistInfoCardProps) => {
  const { user } = useOptimizedAuth();
  const openArtistPortal = useOpenArtistPortal();
  const artist = useArtistInfo({
    artistId,
    fallbackName: artistName,
    fallbackImage: artistImage,
  });

  const canFollow = user?.id !== artistId;

  if (artist.isLoading) {
    return (
      <section className="animate-pulse rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="mb-4 h-4 w-20 rounded bg-neutral-200"></div>
        <div className="mb-4 flex items-center gap-3">
          <div className="h-14 w-14 rounded-full bg-neutral-200"></div>
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-neutral-200"></div>
            <div className="h-3 w-24 rounded bg-neutral-100"></div>
          </div>
        </div>
        <div className="h-11 w-full rounded-xl bg-neutral-100"></div>
      </section>
    );
  }

  if (!artist.hasProfile) {
    return (
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
        <p className="font-grotesk text-sm text-neutral-500">
          Artist information is unavailable.
        </p>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-4 flex items-center justify-between gap-3">
        <div>
          <p className="font-grotesk text-xs font-semibold tracking-[0.1em] text-neutral-400 uppercase">
            Artist
          </p>
          <p className="font-grotesk mt-0.5 text-xs text-neutral-500">
            Meet the creator
          </p>
        </div>
        <span className="font-grotesk rounded-full bg-indigo-50 px-2.5 py-1 text-[10px] font-semibold tracking-wide text-[#1E3A8A] uppercase">
          Know creator
        </span>
      </div>

      <div className="mb-4 flex min-w-0 items-center gap-3">
        <button
          type="button"
          onClick={() => openArtistPortal(artistId)}
          aria-label={`Open ${artist.name}'s profile`}
          className="h-14 w-14 shrink-0 overflow-hidden rounded-full bg-neutral-100 shadow-sm ring-2 ring-white outline outline-neutral-200"
        >
          <img
            src={artist.imageUrl}
            alt={artist.name}
            className="h-full w-full object-cover"
          />
        </button>
        <div className="min-w-0">
          <button
            type="button"
            onClick={() => openArtistPortal(artistId)}
            className="font-helvetica block max-w-full truncate text-left text-base font-bold text-neutral-900 capitalize hover:underline"
          >
            {artist.name}
          </button>
          <p className="font-grotesk mt-1 truncate text-xs text-neutral-500">
            {artist.country || "Creator on Know"}
          </p>
        </div>
      </div>

      <div>
        {user && canFollow ? (
          <ExploreFollowButton artistId={artistId} />
        ) : !user ? (
          <Link
            href="/login"
            className="font-grotesk flex min-h-11 w-full items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50 px-4 text-sm font-semibold text-neutral-700 transition-colors hover:bg-neutral-100"
          >
            Sign in to follow
          </Link>
        ) : (
          <p className="font-grotesk rounded-xl bg-neutral-50 px-3 py-2.5 text-center text-xs text-neutral-500">
            This is your artist profile.
          </p>
        )}
      </div>
    </section>
  );
};

export default ArtistInfoCard;
