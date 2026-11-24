"use client";

import Image from "next/image";
import {
  Camera,
  DollarSign,
  Images,
  ImagePlus,
  ThumbsUp,
  TrendingUp,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTokenStore } from "@/src/features/auth/state/store/token.store";
import AssetPickerDialog from "./asset-picker-dialog";
import { useCollection } from "../hooks/use-collection";
import { useRemoveAssetFromCollection } from "../hooks/use-remove-asset-from-collection";
import { useUpdateCollection } from "../hooks/use-update-collection";

interface Props {
  collectionId: string;
}

export default function CollectionDetail({ collectionId }: Props) {
  const viewerId = useTokenStore((state) => state.user?.id);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPositionX, setBannerPositionX] = useState<number | null>(null);
  const [bannerPositionY, setBannerPositionY] = useState<number | null>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const profileInput = useRef<HTMLInputElement>(null);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const collectionQuery = useCollection(collectionId);
  const collection = collectionQuery.data?.data;
  const owner = Boolean(
    collection && viewerId && collection.ownerId === viewerId,
  );
  const update = useUpdateCollection();
  const removeAsset = useRemoveAssetFromCollection();

  useEffect(() => {
    if (!bannerImage) {
      setBannerPreview(null);
      return;
    }
    const url = URL.createObjectURL(bannerImage);
    setBannerPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [bannerImage]);

  useEffect(() => {
    if (!profileImage) {
      setProfilePreview(null);
      return;
    }
    const url = URL.createObjectURL(profileImage);
    setProfilePreview(url);
    return () => URL.revokeObjectURL(url);
  }, [profileImage]);

  if (collectionQuery.isLoading)
    return (
      <main className="p-10 text-center text-neutral-500">
        Loading collection…
      </main>
    );

  if (collectionQuery.isError || !collection)
    return (
      <main className="p-10 text-center text-neutral-600">
        Collection could not be loaded.
      </main>
    );

  const money = (value: string | number) =>
    `${collection.currency || "USD"} ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update.mutate(
      {
        collectionId,
        title: title ?? collection.title,
        description: description ?? collection.description ?? "",
        bannerImage,
        profileImage,
        bannerPositionX: bannerPositionX ?? collection.bannerPositionX ?? 50,
        bannerPositionY: bannerPositionY ?? collection.bannerPositionY ?? 50,
      },
      {
        onSuccess: () => {
          setBannerImage(null);
          setProfileImage(null);
          setBannerPositionX(null);
          setBannerPositionY(null);
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-white text-neutral-900">
      <div className="group relative h-56 bg-neutral-200 sm:h-72">
        {(bannerPreview || collection.bannerUrl) && (
          <Image
            src={bannerPreview || collection.bannerUrl!}
            alt="Collection banner"
            fill
            unoptimized={Boolean(bannerPreview)}
            style={{
              objectPosition: `${bannerPositionX ?? collection.bannerPositionX ?? 50}% ${bannerPositionY ?? collection.bannerPositionY ?? 50}%`,
            }}
            className="object-cover"
          />
        )}
        {owner && (
          <>
            <input
              ref={bannerInput}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(event) =>
                setBannerImage(event.target.files?.[0] ?? null)
              }
            />
            <button
              type="button"
              onClick={() => bannerInput.current?.click()}
              className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/15 text-white opacity-100 transition hover:bg-black/30 focus-visible:bg-black/30 focus-visible:outline-none sm:bg-black/0 sm:opacity-0 sm:hover:opacity-100 sm:focus-visible:opacity-100"
              aria-label="Choose collection banner image"
            >
              <span className="font-bebas flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm tracking-wider">
                <Camera className="h-4 w-4" />
                {bannerPreview || collection.bannerUrl
                  ? "Change banner"
                  : "Add banner"}
              </span>
            </button>
          </>
        )}
      </div>
      <section className="relative z-10 mx-auto max-w-6xl px-5 pb-12">
        <div className="relative -mt-12 flex items-end gap-4">
          <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-white bg-neutral-300 shadow-sm">
            {(profilePreview || collection.imageUrl) && (
              <Image
                src={profilePreview || collection.imageUrl!}
                alt="Collection profile image"
                fill
                unoptimized={Boolean(profilePreview)}
                className="object-cover"
              />
            )}
            {owner && (
              <>
                <input
                  ref={profileInput}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={(event) =>
                    setProfileImage(event.target.files?.[0] ?? null)
                  }
                />
                <button
                  type="button"
                  onClick={() => profileInput.current?.click()}
                  aria-label="Choose collection profile image"
                  className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/35 text-white opacity-100 transition hover:bg-black/50 focus-visible:bg-black/50 focus-visible:outline-none sm:bg-black/0 sm:opacity-0 sm:hover:bg-black/50 sm:hover:opacity-100 sm:focus-visible:bg-black/50 sm:focus-visible:opacity-100"
                >
                  <Camera className="h-5 w-5" />
                </button>
              </>
            )}
          </div>
          <div className="pb-2">
            <p className="font-grotesk text-sm text-neutral-500 capitalize">
              By {collection.firstName} {collection.lastName}
              {collection.username ? ` · @${collection.username}` : ""}
            </p>
            <p className="font-grotesk text-xs text-neutral-500 uppercase">
              Published {new Date(collection.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
        <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_280px]">
          <div>
            {owner ? (
              <form className="space-y-3" onSubmit={save}>
                <input
                  aria-label="Collection title"
                  className="font-helvetica w-full rounded-lg border p-3 text-3xl font-bold"
                  value={title ?? collection.title}
                  onChange={(event) => setTitle(event.target.value)}
                />
                <textarea
                  aria-label="Collection description"
                  className="font-grotesk w-full rounded-lg border p-3 text-sm"
                  rows={3}
                  value={description ?? collection.description ?? ""}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <div className="grid gap-3 rounded-lg bg-neutral-50 p-3 sm:grid-cols-2">
                  <label className="font-grotesk text-xs text-neutral-700 uppercase">
                    Horizontal banner position:{" "}
                    {bannerPositionX ?? collection.bannerPositionX ?? 50}%
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={
                        bannerPositionX ?? collection.bannerPositionX ?? 50
                      }
                      onChange={(event) =>
                        setBannerPositionX(Number(event.target.value))
                      }
                      style={{
                        background: `linear-gradient(to right, #1E3A8A ${bannerPositionX ?? collection.bannerPositionX ?? 50}%, #d1d5db ${bannerPositionX ?? collection.bannerPositionX ?? 50}%)`,
                      }}
                      className="ios-range-slider mt-2 block w-full"
                    />
                  </label>
                  <label className="font-grotesk text-xs text-neutral-700 uppercase">
                    Vertical banner position:{" "}
                    {bannerPositionY ?? collection.bannerPositionY ?? 50}%
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={
                        bannerPositionY ?? collection.bannerPositionY ?? 50
                      }
                      onChange={(event) =>
                        setBannerPositionY(Number(event.target.value))
                      }
                      style={{
                        background: `linear-gradient(to right, #1E3A8A ${bannerPositionY ?? collection.bannerPositionY ?? 50}%, #d1d5db ${bannerPositionY ?? collection.bannerPositionY ?? 50}%)`,
                      }}
                      className="ios-range-slider mt-2 block w-full"
                    />
                  </label>
                </div>
                <button
                  className="font-bebas rounded-lg bg-[#1E3A8A] px-4 py-2 tracking-wider text-white"
                  disabled={update.isPending}
                >
                  {update.isPending ? "Saving…" : "Save details"}
                </button>
                {update.isError && (
                  <p className="text-sm text-red-600">
                    Could not save changes.
                  </p>
                )}
              </form>
            ) : (
              <>
                <h1 className="text-3xl font-bold">{collection.title}</h1>
                <p className="mt-3 whitespace-pre-wrap text-neutral-600">
                  {collection.description}
                </p>
              </>
            )}
          </div>
          <aside className="rounded-xl bg-neutral-100 p-4 text-sm">
            <div className="flex items-center gap-2 text-neutral-700">
              <Images aria-hidden="true" className="h-4 w-4 text-neutral-500" />
              <span className="font-grotesk text-xs uppercase lg:text-sm">
                {collection.numOfArt} assets
              </span>
              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>
              <ThumbsUp
                aria-hidden="true"
                className="h-4 w-4 text-neutral-500"
              />
              <span className="font-grotesk text-xs uppercase lg:text-sm">
                {collection.numOfLikes} likes
              </span>
            </div>
            <p className="mt-5 flex items-center gap-2 lg:mt-10">
              <DollarSign
                aria-hidden="true"
                className="h-4 w-4 text-neutral-500"
              />
              <span className="font-grotesk text-xs uppercase lg:text-sm">
                Collection price: <strong>{money(collection.price)}</strong>
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Images aria-hidden="true" className="h-4 w-4 text-neutral-500" />
              <span className="font-grotesk text-xs uppercase lg:text-sm">
                Asset price total:{" "}
                <strong>{money(collection.assetPriceTotal)}</strong>
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <TrendingUp
                aria-hidden="true"
                className="h-4 w-4 text-neutral-500"
              />
              <span className="font-grotesk text-xs uppercase lg:text-sm">
                Completed sales:{" "}
                <strong>{money(collection.completedSalesVolume)}</strong>
              </span>
            </p>
          </aside>
        </div>
        {owner && (
          <button
            type="button"
            onClick={() => setAssetPickerOpen(true)}
            className="font-bebas mt-8 inline-flex min-h-11 items-center gap-2 rounded-lg bg-neutral-500 px-4 py-2 tracking-wider text-white transition hover:bg-neutral-800"
          >
            <ImagePlus className="h-4 w-4" />
            Add assets
          </button>
        )}
        {collection.assetData.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {collection.assetData.map((asset) => (
              <article key={asset.fileId} className="relative min-w-0">
                <div className="artwork-oak-frame group relative w-full shadow-lg transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]">
                  <div className="artwork-oak-mat aspect-[4/3] w-full overflow-hidden">
                    {asset.assetUrl && (
                      <Image
                        src={asset.assetUrl}
                        alt={asset.artTitle}
                        fill
                        sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                        className="object-contain transition-transform duration-300 select-none group-hover:scale-[1.02]"
                      />
                    )}
                  </div>
                </div>
                <div className="flex items-center justify-between p-3">
                  <div>
                    <h2 className="font-semibold">{asset.artTitle}</h2>
                    <p className="text-sm text-neutral-500">
                      {money(asset.artPrice)} · {asset.numOfLikes} likes
                    </p>
                  </div>
                  {owner && (
                    <button
                      type="button"
                      disabled={removeAsset.isPending}
                      onClick={() =>
                        removeAsset.mutate({
                          collectionId,
                          fileId: asset.fileId,
                        })
                      }
                      className="text-sm text-red-600"
                    >
                      Remove
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <p className="font-bebas py-16 text-center tracking-wider text-neutral-500">
            This collection has no assets yet.
          </p>
        )}
      </section>
      {owner && assetPickerOpen && (
        <AssetPickerDialog
          artistId={collection.ownerId}
          collectionId={collectionId}
          existingAssetIds={collection.assetData.map((asset) => asset.fileId)}
          onClose={() => setAssetPickerOpen(false)}
        />
      )}
    </main>
  );
}
