"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Camera, Tag, X } from "lucide-react";
import { motion } from "framer-motion";
import { useCreateCollection } from "../hooks/use-create-collection";

export default function CreateCollectionForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [price, setPrice] = useState("0");
  const [currency, setCurrency] = useState("NGN");
  const [bannerPositionX, setBannerPositionX] = useState(50);
  const [bannerPositionY, setBannerPositionY] = useState(50);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const profileInput = useRef<HTMLInputElement>(null);
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
        tags,
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

  const addTag = () => {
    const tag = tagInput.trim();
    if (tag && !tags.includes(tag)) setTags((current) => [...current, tag]);
    setTagInput("");
  };

  return (
    <main className="min-h-screen bg-neutral-50 px-4 py-10 sm:px-8">
      <form
        onSubmit={create}
        className="mx-auto max-w-3xl overflow-hidden rounded-2xl border bg-white shadow-sm"
      >
        <div className="relative h-44 bg-neutral-200 sm:h-56">
          <input
            ref={bannerInput}
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(event) =>
              setBannerImage(event.target.files?.[0] ?? null)
            }
          />
          {bannerPreview && (
            <Image
              src={bannerPreview}
              alt="Banner preview"
              fill
              unoptimized
              style={{
                objectPosition: `${bannerPositionX}% ${bannerPositionY}%`,
              }}
              className="object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/5" />
          <button
            type="button"
            onClick={() => bannerInput.current?.click()}
            aria-label="Choose collection banner image"
            className="absolute inset-0 z-10 flex cursor-pointer items-center justify-center bg-black/15 text-white opacity-100 transition hover:bg-black/30 focus-visible:bg-black/30 focus-visible:outline-none sm:bg-black/0 sm:opacity-0 sm:hover:opacity-100 sm:focus-visible:opacity-100"
          >
            <span className="font-bebas flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm tracking-wider">
              <Camera className="h-4 w-4" />
              {bannerPreview ? "Change banner" : "Add banner"}
            </span>
          </button>
          <div className="absolute -bottom-12 left-5 z-20 flex h-24 w-24 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-neutral-300 shadow-sm sm:left-8">
            {profilePreview ? (
              <Image
                src={profilePreview}
                alt="Profile image preview"
                fill
                unoptimized
                className="object-cover"
              />
            ) : (
              <span className="text-xs text-neutral-500">Profile</span>
            )}
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
          </div>
          {bannerPreview && (
            <div className="absolute right-3 bottom-3 left-34 z-20 grid grid-cols-2 gap-3 rounded-lg bg-white/90 p-3 shadow-sm backdrop-blur-sm">
              <label className="font-grotesk text-xs text-nowrap text-neutral-700 uppercase">
                Horizontal: {bannerPositionX}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bannerPositionX}
                  onChange={(event) =>
                    setBannerPositionX(Number(event.target.value))
                  }
                  style={{
                    background: `linear-gradient(to right, #1E3A8A ${bannerPositionX}%, #d1d5db ${bannerPositionX}%)`,
                  }}
                  className="ios-range-slider mt-2 block w-full"
                />
              </label>
              <label className="font-grotesk text-xs text-neutral-700 uppercase">
                Vertical: {bannerPositionY}%
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={bannerPositionY}
                  onChange={(event) =>
                    setBannerPositionY(Number(event.target.value))
                  }
                  style={{
                    background: `linear-gradient(to right, #1E3A8A ${bannerPositionY}%, #d1d5db ${bannerPositionY}%)`,
                  }}
                  className="ios-range-slider mt-2 block w-full"
                />
              </label>
            </div>
          )}
        </div>
        <div className="p-5 pt-16 sm:p-8 sm:pt-20">
          <p className="font-grotesk text-sm font-light text-neutral-500">
            New collection
          </p>
          <h1 className="font-helvetica mt-1 text-2xl">
            Create your collection
          </h1>
          <p className="font-grotesk mt-2 text-sm font-light text-neutral-500">
            Add a title and details. You can add artworks after creating it.
          </p>
          <div className="mt-6 space-y-4">
            <label className="font-grotesk block text-sm font-medium tracking-wide text-neutral-600 capitalize">
              Collection name
              <input
                required
                maxLength={255}
                autoFocus
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                placeholder="Untitled collection"
                className="font-helvetica mt-1 w-full rounded-lg border p-3 text-base text-neutral-500 capitalize"
              />
            </label>
            <label className="font-grotesk block text-sm font-medium text-neutral-600">
              Description
              <textarea
                maxLength={1000}
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                placeholder="What brings these artworks together?"
                className="font-grotesk mt-1 w-full rounded-lg border p-3 font-light text-neutral-600"
              />
            </label>
            <section aria-label="Collection tags" className="space-y-3">
              <div className="flex gap-2">
                <input
                  aria-label="Add a tag"
                  value={tagInput}
                  onChange={(event) => setTagInput(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addTag();
                    }
                  }}
                  placeholder="Add a tag"
                  className="font-grotesk min-h-11 min-w-0 flex-1 rounded-lg border p-3 text-sm font-light text-neutral-600"
                />
                <button
                  type="button"
                  onClick={addTag}
                  disabled={!tagInput.trim()}
                  className="font-bebas rounded-lg bg-[#1E3A8A] px-4 text-sm tracking-wider text-white disabled:opacity-50"
                >
                  Add
                </button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag, index) => (
                    <motion.span
                      key={tag}
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.4 }}
                      transition={{
                        duration: 0.35,
                        delay: Math.min(index, 8) * 0.12,
                        ease: "easeOut",
                      }}
                      className="font-bebas inline-flex min-h-9 items-center gap-2 rounded-full border bg-neutral-100 px-3 py-1 text-xs tracking-wider capitalize"
                    >
                      <Tag
                        className="h-4 w-4 text-neutral-500"
                        aria-hidden="true"
                      />
                      {tag}
                      <button
                        type="button"
                        aria-label={`Remove ${tag} tag`}
                        onClick={() =>
                          setTags((current) =>
                            current.filter((item) => item !== tag),
                          )
                        }
                        className="font-bebas rounded-full p-1 tracking-wider text-neutral-600 hover:bg-neutral-200"
                      >
                        <X className="h-3 w-3" aria-hidden="true" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              )}
            </section>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="font-grotesk block text-sm font-medium text-neutral-600 capitalize">
                Collection price
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  className="font-grotesk mt-1 w-full rounded-lg border p-3 font-light text-neutral-600"
                />
              </label>
              <label className="font-grotesk block text-sm font-medium text-neutral-600 capitalize">
                Currency
                <select
                  value={currency}
                  onChange={(event) => setCurrency(event.target.value)}
                  className="font-grotesk mt-1 w-full rounded-lg border p-3 font-light text-neutral-600"
                >
                  <option value="NGN">NGN</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                  <option value="GBP">GBP</option>
                </select>
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
              className="font-bebas rounded-xl bg-[#1E3A8A] px-5 py-2.5 text-sm font-medium tracking-wider text-white disabled:opacity-60"
            >
              {createCollection.isPending ? "Creating…" : "Create collection"}
            </button>
          </div>
        </div>
      </form>
    </main>
  );
}
