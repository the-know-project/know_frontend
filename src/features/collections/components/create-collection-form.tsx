"use client";

import { useState, type FormEvent } from "react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCreateCollection } from "../hooks/use-create-collection";

export default function CreateCollectionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("NGN");
  const [bannerPositionX, setBannerPositionX] = useState(50);
  const [bannerPositionY, setBannerPositionY] = useState(50);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const createCollection = useCreateCollection();

  useEffect(() => {
    if (!bannerImage) {
      setBannerPreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(bannerImage);
    setBannerPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [bannerImage]);

  useEffect(() => {
    if (!profileImage) {
      setProfilePreview(null);
      return;
    }
    const previewUrl = URL.createObjectURL(profileImage);
    setProfilePreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [profileImage]);

  const create = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!title.trim()) return;
    createCollection.mutate(
      {
        title: title.trim(),
        description: description.trim(),
        price: price || "0",
        currency,
        bannerImage,
        profileImage,
        bannerPositionX,
        bannerPositionY,
      },
      {
        onSuccess: (result) => {
          if (result.data?.id) router.replace(`/collections/${result.data.id}`);
        },
      },
    );
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-8">
      <form
        onSubmit={create}
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white shadow-sm"
      >
        <div className="relative h-44 bg-neutral-200 sm:h-56">
          {bannerPreview && <Image src={bannerPreview} alt="Banner preview" fill unoptimized style={{ objectPosition: `${bannerPositionX}% ${bannerPositionY}%` }} className="object-cover" />}
          <div className="absolute inset-0 bg-black/5" />
          <div className="absolute -bottom-12 left-5 z-10 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-neutral-300 shadow-sm sm:left-8">
            {profilePreview ? <Image src={profilePreview} alt="Profile image preview" fill unoptimized className="object-cover" /> : <span className="text-xs text-neutral-500">Profile</span>}
          </div>
          {bannerPreview && (
            <div className="absolute right-3 bottom-3 left-32 z-20 grid grid-cols-2 gap-3 rounded-lg bg-white/90 p-3 shadow-sm backdrop-blur-sm">
              <label className="text-xs text-neutral-700">
                Horizontal: {bannerPositionX}%
                <input type="range" min="0" max="100" value={bannerPositionX} onChange={(event) => setBannerPositionX(Number(event.target.value))} style={{ background: `linear-gradient(to right, #2563eb ${bannerPositionX}%, #d1d5db ${bannerPositionX}%)` }} className="ios-range-slider mt-2 block w-full" />
              </label>
              <label className="text-xs text-neutral-700">
                Vertical: {bannerPositionY}%
                <input type="range" min="0" max="100" value={bannerPositionY} onChange={(event) => setBannerPositionY(Number(event.target.value))} style={{ background: `linear-gradient(to right, #2563eb ${bannerPositionY}%, #d1d5db ${bannerPositionY}%)` }} className="ios-range-slider mt-2 block w-full" />
              </label>
            </div>
          )}
        </div>
        <div className="p-5 pt-16 sm:p-8 sm:pt-20">
          <p className="font-grotesk text-sm font-medium text-neutral-500">
            New collection
          </p>
          <h1 className="font-helvetica mt-1 text-2xl font-bold">
            Create your collection
          </h1>
          <p className="font-grotesk mt-2 text-sm font-light text-neutral-600">
            Add a title and details. You can add artworks after creating it.
          </p>
          <div className="mt-6 space-y-4">
            <label className="font-grotesk block text-sm font-medium tracking-wide capitalize">
              Collection name
              <input
                required
                maxLength={255}
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Untitled collection"
                className="placeholder:font-grotesk font-helvetica mt-1 w-full rounded-lg border p-3 text-base text-neutral-600 capitalize"
              />
            </label>
            <label className="font-grotesk block text-sm font-medium">
              Description
              <textarea
                maxLength={1000}
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What brings these artworks together?"
                className="font-grotesk mt-1 w-full rounded-lg border p-3 font-normal text-neutral-600"
              />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm font-medium">
                Collection price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="font-grotesk mt-1 w-full rounded-lg border p-3 text-neutral-600"
                />
              </label>
              <label className="block text-sm font-medium">
                Currency
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="font-grotesk mt-1 w-full rounded-lg border p-3 text-neutral-600"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
              </label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-grotesk block text-sm font-medium">
                Banner image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setBannerImage(event.target.files?.[0] ?? null)
                  }
                  className="mt-2 block w-full text-sm text-neutral-600"
                />
              </label>
              <label className="font-grotesk block text-sm font-medium">
                Profile image
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) =>
                    setProfileImage(event.target.files?.[0] ?? null)
                  }
                  className="mt-2 block w-full text-sm text-neutral-600"
                />
              </label>
            </div>
          </div>
          {createCollection.isError && (
            <p role="alert" className="mt-4 text-sm text-red-600">
              Could not create the collection. Please try again.
            </p>
          )}
          {!createCollection.isError &&
            createCollection.isSuccess &&
            !createCollection.data.data?.id && (
              <p role="alert" className="mt-4 text-sm text-red-600">
                Collection created, but the collection page could not be opened.
              </p>
            )}
          <div className="mt-8 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => router.back()}
              className="font-bebas rounded-xl border px-5 py-2.5 text-sm tracking-wider"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={createCollection.isPending || !title.trim()}
              className="font-bebas rounded-xl bg-neutral-900 px-5 py-2.5 text-sm font-medium tracking-wider text-white disabled:opacity-60"
            >
              {createCollection.isPending ? "Creating…" : "Create collection"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
