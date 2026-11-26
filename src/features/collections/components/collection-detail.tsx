"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  DollarSign,
  Ellipsis,
  Eye,
  Heart,
  Images,
  ImagePlus,
  Pencil,
  Tag,
  Trash2,
  TrendingUp,
  Plus,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "sonner";
import { IconThumbUp, IconThumbUpFilled } from "@tabler/icons-react";
import { useTokenStore } from "@/src/features/auth/state/store/token.store";
import ArtDetails from "@/src/shared/components/art-details";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import type { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { useAssetLike } from "@/src/features/explore/hooks/use-asset-like";
import { useToggleExploreContent } from "@/src/features/explore/state/explore-content.store";
import { formatViewCount } from "@/src/utils/number-format";
import AssetPickerDialog from "./asset-picker-dialog";
import { useCollection } from "../hooks/use-collection";
import { useRemoveAssetFromCollection } from "../hooks/use-remove-asset-from-collection";
import { useUpdateCollection } from "../hooks/use-update-collection";
import { useToggleCollectionLike } from "../hooks/use-toggle-collection-like";
import { useTrackCollectionView } from "../hooks/use-track-collection-view";
import TextEffectWithExit from "@/src/shared/components/animate-text";
import { useGetCategories } from "@/src/features/personalize/hooks";
import UploadCanvas, {
  type UploadAssetForEdit,
} from "@/src/features/upload/components/upload-canvas";
import type { CollectionAsset } from "../types/collection.types";

interface Props {
  collectionId: string;
}

interface CollectionAssetLikeButtonProps {
  assetId: string;
  artTitle: string;
  initialLikeCount: number;
}

function CollectionAssetLikeButton({
  assetId,
  artTitle,
  initialLikeCount,
}: CollectionAssetLikeButtonProps) {
  const { isLiked, likeCount, toggleLike, isLoading } = useAssetLike({
    assetId,
    initialLikeCount,
  });

  return (
    <button
      type="button"
      onClick={() => void toggleLike()}
      disabled={isLoading}
      aria-pressed={isLiked}
      aria-label={`${isLiked ? "Unlike" : "Like"} ${artTitle}`}
      title={`${isLiked ? "Unlike" : "Like"} ${artTitle}`}
      className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-neutral-600 transition hover:text-[#1E3A8A] focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
    >
      {isLiked ? (
        <IconThumbUpFilled
          width={20}
          height={20}
          className="text-[#1E3A8A]"
          aria-hidden="true"
        />
      ) : (
        <IconThumbUp
          width={20}
          height={20}
          className="text-neutral-500"
          aria-hidden="true"
        />
      )}
      <span className="font-grotesk text-xs font-semibold">
        {formatViewCount(likeCount)}
      </span>
    </button>
  );
}

interface CollectionAssetActionsToggleProps {
  assetId: string;
  assetTitle: string;
  disabled: boolean;
  onEdit: () => void;
  onRemove: () => void;
}

function CollectionAssetActionsToggle({
  assetId,
  assetTitle,
  disabled,
  onEdit,
  onRemove,
}: CollectionAssetActionsToggleProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);
  const menuId = `collection-asset-actions-${assetId}`;

  const closeMenu = () => {
    setIsOpen(false);
    setConfirmDelete(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setConfirmDelete(false);
      }
    };

    if (isOpen) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  return (
    <div
      ref={toggleRef}
      className="relative"
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
    >
      <button
        type="button"
        onClick={() => {
          if (isOpen) setConfirmDelete(false);
          setIsOpen((open) => !open);
        }}
        disabled={disabled}
        aria-label={isOpen ? "Close asset actions" : "Open asset actions"}
        aria-expanded={isOpen}
        aria-controls={menuId}
        className="group flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/70 bg-neutral-950/75 text-white shadow-lg shadow-black/20 backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Ellipsis className="h-5 w-5 transition-transform group-hover:rotate-90" />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={menuId}
            aria-label="Collection asset actions"
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.98 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute top-12 left-0 z-40 w-60 origin-top-left overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 p-1.5 text-neutral-900 shadow-2xl shadow-black/20 backdrop-blur-xl"
          >
            <div className="flex items-center justify-between px-3 pt-2 pb-2">
              <div>
                <p className="font-bebas text-xs tracking-[0.12em] text-neutral-500 uppercase">
                  Collection asset
                </p>
                <p className="font-grotesk mt-0.5 text-[11px] text-neutral-400">
                  Manage this asset
                </p>
              </div>
            </div>

            {confirmDelete ? (
              <div className="space-y-2 rounded-xl bg-red-50 p-3">
                <p className="font-bebas text-xs font-semibold tracking-wider text-red-800">
                  Remove this asset?
                </p>
                <p className="font-grotesk text-[11px] leading-4 text-red-700">
                  “{assetTitle}” will be removed from this collection.
                </p>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="font-bebas flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg border border-red-200 bg-white text-xs font-semibold tracking-wider text-neutral-700 transition-colors hover:bg-red-100 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-500"
                  >
                    <X className="h-3.5 w-3.5" /> Keep it
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      onRemove();
                      closeMenu();
                    }}
                    className="font-bebas flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 text-xs font-semibold tracking-wider text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Remove
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onEdit();
                    closeMenu();
                  }}
                  className="font-grotesk flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium capitalize transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                >
                  <Pencil className="h-4 w-4 text-neutral-500" />
                  <span>Edit asset</span>
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="font-grotesk flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-red-600 capitalize transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Remove from collection</span>
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CollectionDetail({ collectionId }: Props) {
  const router = useRouter();
  const viewerId = useTokenStore((state) => state.user?.id);
  const [title, setTitle] = useState<string | null>(null);
  const [description, setDescription] = useState<string | null>(null);
  const [tags, setTags] = useState<string[] | null>(null);
  const [tagInput, setTagInput] = useState("");
  const [tagInputOpen, setTagInputOpen] = useState(false);
  const [bannerImage, setBannerImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string | null>(null);
  const [profilePreview, setProfilePreview] = useState<string | null>(null);
  const [bannerPositionX, setBannerPositionX] = useState<number | null>(null);
  const [bannerPositionY, setBannerPositionY] = useState<number | null>(null);
  const bannerInput = useRef<HTMLInputElement>(null);
  const profileInput = useRef<HTMLInputElement>(null);
  const trackedViewId = useRef<string | null>(null);
  const [assetPickerOpen, setAssetPickerOpen] = useState(false);
  const [editingAsset, setEditingAsset] = useState<UploadAssetForEdit | null>(
    null,
  );
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [availabilityFilter, setAvailabilityFilter] = useState<boolean | null>(
    null,
  );
  const [dateSort, setDateSort] = useState<"latest" | "oldest" | null>(null);
  const [priceTier, setPriceTier] = useState<
    "middle" | "high" | "premium" | null
  >(null);
  const collectionQuery = useCollection(collectionId);
  const categoriesQuery = useGetCategories();
  const collection = collectionQuery.data?.data;
  const collectionLike = useToggleCollectionLike();
  const trackView = useTrackCollectionView();
  useEffect(() => {
    if (!collection || trackedViewId.current === collection.id) return;
    trackedViewId.current = collection.id;
    trackView.mutate({ collectionId: collection.id });
  }, [collection?.id, trackView.mutate]);
  useEffect(() => {
    if (collection) setTags(collection.tags ?? []);
  }, [collection?.id, collection?.tags]);
  const owner = Boolean(
    collection && viewerId && collection.ownerId === viewerId,
  );
  const collectionTags = tags ?? collection?.tags ?? [];
  const displayedTags =
    collectionTags.length > 0 ? collectionTags : ["Know Creator"];
  const update = useUpdateCollection();
  const removeAsset = useRemoveAssetFromCollection();
  const toggleExploreContent = useToggleExploreContent();

  const hasActiveAssetFilters =
    selectedCategories.length > 0 ||
    availabilityFilter !== null ||
    dateSort !== null ||
    priceTier !== null;
  const visibleAssets = collection
    ? collection.assetData
        .filter((asset) => {
          if (
            selectedCategories.length > 0 &&
            !asset.artCategories?.some((category) =>
              selectedCategories.includes(category),
            )
          ) {
            return false;
          }
          if (
            availabilityFilter !== null &&
            Boolean(asset.isArtListed ?? true) !== availabilityFilter
          ) {
            return false;
          }
          const price = Number(asset.artPrice);
          if (priceTier === "middle" && !(price >= 50 && price <= 500)) {
            return false;
          }
          if (priceTier === "high" && !(price > 500 && price < 1500)) {
            return false;
          }
          if (priceTier === "premium" && !(price >= 1500)) {
            return false;
          }
          return true;
        })
        .sort((first, second) => {
          if (!dateSort) return 0;
          const firstDate = new Date(
            first.artCreatedAt ?? collection.createdAt,
          ).getTime();
          const secondDate = new Date(
            second.artCreatedAt ?? collection.createdAt,
          ).getTime();
          return dateSort === "latest"
            ? secondDate - firstDate
            : firstDate - secondDate;
        })
    : [];

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
      <main className="flex items-center justify-center p-10 text-center text-neutral-500">
        <TextEffectWithExit
          text="loading collection"
          style="!font-bebas items-center !text-neutral-600 tracking-wider"
        />
      </main>
    );

  if (collectionQuery.isError || !collection)
    return (
      <main className="font-bebas flex items-center justify-center p-10 text-center tracking-wider text-neutral-600">
        Collection could not be loaded.
      </main>
    );

  const money = (value: string | number) =>
    `${collection.currency || "USD"} ${Number(value || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  const formatMetricCount = (value: number | undefined, singular: string) => {
    const count = Number(value ?? 0);
    return `${count.toLocaleString()} ${count === 1 ? singular : `${singular}s`}`;
  };

  const removeCollectionAsset = (fileId: string, artTitle: string) => {
    const toastId = toast.loading(`Removing ${artTitle} from collection`, {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });
    removeAsset.mutate(
      { collectionId, fileId },
      {
        onSuccess: () => {
          toast.success("Asset removed from collection", {
            id: toastId,
            icon: <ToastIcon />,
            description: (
              <ToastDescription
                description={`Removed “${artTitle}” from your collection.`}
              />
            ),
            style: {
              backdropFilter: "-moz-initial",
              opacity: "-moz-initial",
              backgroundColor: "oklch(62.7% 0.194 149.214)",
              fontSize: "15px",
              font: "Space Grotesk",
              color: "#ffffff",
              fontWeight: "bolder",
            },
          });
        },
        onError: (error) => {
          toast("Could not remove asset from collection", {
            id: toastId,
            icon: <ToastIcon />,
            description: (
              <ToastDescription
                description={
                  error instanceof Error ? error.message : "Please try again."
                }
              />
            ),
            style: {
              backdropFilter: "-moz-initial",
              opacity: "-moz-initial",
              backgroundColor: "oklch(62.8% 0.258 29.234)",
              fontSize: "15px",
              font: "Space Grotesk",
              color: "#ffffff",
              fontWeight: "bolder",
            },
          });
        },
      },
    );
  };

  const editCollectionAsset = (asset: CollectionAsset) => {
    setEditingAsset({
      fileId: asset.fileId,
      name: asset.artTitle,
      description: asset.artDescription ?? "",
      size: {
        width: asset.artSize?.width,
        height: asset.artSize?.height,
        depth: asset.artSize?.depth,
        diameter: asset.artSize?.diameter,
        length: asset.artSize?.length,
        weight: asset.artSize?.weight ?? 0,
        aspectRatio: asset.artSize?.aspectRatio,
        weightUnit: asset.artSize?.weightUnit,
        dimensionUnit: asset.artSize?.dimensionUnit,
      },
      categories: asset.artCategories ?? [],
      tags: asset.artTags ?? [],
      url: asset.assetUrl,
    });
  };

  const openAssetDetails = (asset: (typeof collection.assetData)[number]) => {
    const content: IExploreContent = {
      id: asset.fileId,
      userId: asset.artistId || collection.ownerId,
      creatorProfileUrl: asset.artistProfileUrl || collection.imageUrl || "",
      creatorName: `${collection.firstName} ${collection.lastName}`.trim(),
      artName: asset.artTitle,
      description: asset.artDescription ?? null,
      artWorkUrl: asset.assetUrl,
      highResUrl: asset.assetUrl,
      extraUrls: [],
      highResExtraUrls: [],
      categories: asset.artCategories || [],
      tags: asset.artTags || [],
      price: asset.artPrice,
      size: asset.artSize || {},
      numOfLikes: asset.numOfLikes,
      numOfViews: asset.artViewCount || 0,
      numOfComments: 0,
      isListed: asset.isArtListed ?? true,
      createdAt: asset.artCreatedAt
        ? new Date(asset.artCreatedAt)
        : new Date(collection.createdAt),
    };

    toggleExploreContent(asset.fileId, content, {
      scrollY: window.scrollY,
      viewportHeight: window.innerHeight,
    });
  };

  const save = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    update.mutate(
      {
        collectionId,
        title: title ?? collection.title,
        description: description ?? collection.description ?? "",
        tags: tags ?? collection.tags ?? [],
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

  const addTag = () => {
    const tag = tagInput.trim();
    const currentTags = tags ?? collection.tags ?? [];
    if (tag && !currentTags.includes(tag)) setTags([...currentTags, tag]);
    setTagInput("");
    setTagInputOpen(false);
  };

  const tagsContent = (
    <div
      className="mt-3 flex w-full flex-wrap items-center gap-2 rounded-xl bg-neutral-100 px-3 py-3"
      aria-label="Collection tags"
    >
      {displayedTags.map((tag, index) => (
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
          className="font-bebas inline-flex min-h-8 items-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 px-3 py-1 text-xs font-medium tracking-widest text-neutral-700"
        >
          <Tag className="h-4 w-4 text-neutral-500" aria-hidden="true" />
          {tag}
          {owner && collectionTags.includes(tag) && (
            <button
              type="button"
              aria-label={`Remove ${tag} tag`}
              onClick={() =>
                setTags(collectionTags.filter((item) => item !== tag))
              }
              className="rounded-full p-1 text-neutral-500 transition hover:bg-neutral-200 hover:text-neutral-900"
            >
              <X className="h-3 w-3" aria-hidden="true" />
            </button>
          )}
        </motion.span>
      ))}
      {owner && (
        <>
          <motion.button
            type="button"
            aria-label="Add collection tag"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{
              duration: 0.35,
              delay: Math.min(displayedTags.length, 8) * 0.12,
              ease: "easeOut",
            }}
            onClick={() => setTagInputOpen((open) => !open)}
            className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-dashed border-neutral-400 text-neutral-600 hover:bg-neutral-100"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
          </motion.button>
          {tagInputOpen && (
            <div className="flex min-w-0 gap-2">
              <input
                autoFocus
                aria-label="New collection tag"
                value={tagInput}
                onChange={(event) => setTagInput(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    addTag();
                  }
                }}
                placeholder="Tag name"
                className="font-grotesk h-9 w-36 rounded-lg border px-3 text-sm"
              />
              <button
                type="button"
                disabled={!tagInput.trim()}
                onClick={addTag}
                className="font-bebas rounded-lg bg-[#1E3A8A] px-3 text-xs tracking-wider text-white disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );

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
        <button
          type="button"
          onClick={() => router.back()}
          aria-label="Back to collections"
          className="font-bebas absolute top-4 right-4 z-20 inline-flex min-h-11 items-center gap-2 rounded-full border border-white/30 bg-black/55 px-4 text-sm font-medium tracking-wider text-white shadow-md backdrop-blur transition hover:bg-black/75 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Back
        </button>
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
          {!owner && (
            <motion.button
              type="button"
              disabled={collectionLike.isPending}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.35, ease: "easeOut" }}
              onClick={() =>
                collectionLike.mutate({
                  collectionId,
                  isLiked: Boolean(collection.isLikedByUser),
                })
              }
              aria-pressed={Boolean(collection.isLikedByUser)}
              aria-label={
                collection.isLikedByUser
                  ? "Unlike collection"
                  : "Like collection"
              }
              className="ml-auto inline-flex shrink-0 items-center gap-1.5 rounded-full px-1 py-1 text-rose-600 transition hover:text-rose-700 focus-visible:ring-2 focus-visible:ring-rose-500 focus-visible:outline-none disabled:opacity-60"
            >
              <Heart
                aria-hidden="true"
                className={`h-5 w-5 ${collection.isLikedByUser ? "fill-rose-500 text-rose-500" : "text-rose-500"}`}
              />
              <span className="font-grotesk text-xs font-bold uppercase lg:text-sm">
                {formatMetricCount(collection.numOfLikes, "like")}
              </span>
            </motion.button>
          )}
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
                  className="font-grotesk w-full rounded-lg border p-3 text-sm font-light"
                  rows={3}
                  value={description ?? collection.description ?? ""}
                  onChange={(event) => setDescription(event.target.value)}
                />
                {tagsContent}
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
                  className="font-bebas rounded-md border !border-[#666666] bg-[#1E3A8A] px-2 py-1 text-sm tracking-wider text-white transition-all duration-300 hover:scale-105 active:scale-95 lg:px-3 lg:py-2 lg:text-base"
                  disabled={update.isPending}
                >
                  {update.isPending ? "Saving…" : "Save"}
                </button>
                {update.isError && (
                  <p className="text-sm text-red-600">
                    Could not save changes.
                  </p>
                )}
              </form>
            ) : (
              <>
                <h1 className="font-helvetica text-3xl font-bold">
                  {collection.title}
                </h1>
                <p className="font-grotesk mt-3 text-sm font-light whitespace-pre-wrap text-neutral-600">
                  {collection.description}
                </p>
                {tagsContent}
              </>
            )}
          </div>
          <aside className="rounded-xl bg-neutral-100 p-4 text-sm font-medium">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.4 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.12 } },
              }}
              className="flex flex-wrap items-center gap-2 text-neutral-700"
            >
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <Images aria-hidden="true" className="h-4 w-4 text-blue-600" />
                <span className="font-grotesk text-xs text-neutral-700 uppercase lg:text-sm">
                  {formatMetricCount(collection.numOfArt, "asset")}
                </span>
              </motion.div>
              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  visible: { opacity: 1, y: 0 },
                }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="flex items-center gap-2"
              >
                <Eye aria-hidden="true" className="h-4 w-4 text-sky-600" />
                <span className="font-grotesk text-xs text-neutral-700 uppercase lg:text-sm">
                  {formatMetricCount(collection.numOfViews, "view")}
                </span>
              </motion.div>
              <span aria-hidden="true" className="text-neutral-300">
                ·
              </span>
              {owner && (
                <motion.div
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  className="flex items-center gap-2"
                >
                  <Heart aria-hidden="true" className="h-4 w-4 text-rose-500" />
                  <span className="font-grotesk text-xs text-neutral-700 uppercase lg:text-sm">
                    {formatMetricCount(collection.numOfLikes, "like")}
                  </span>
                </motion.div>
              )}
            </motion.div>
            {collectionLike.isError && (
              <p
                role="alert"
                className="font-bebas mt-2 text-xs tracking-wider text-red-600"
              >
                Could not update the collection like. Please try again.
              </p>
            )}
            <p className="mt-5 flex items-center gap-2 lg:mt-10">
              <DollarSign
                aria-hidden="true"
                className="h-4 w-4 text-emerald-600"
              />
              <span className="font-grotesk text-xs text-neutral-700 uppercase lg:text-sm">
                Collection price: {money(collection.price)}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <Images aria-hidden="true" className="h-4 w-4 text-violet-600" />
              <span className="font-grotesk text-xs text-neutral-700 uppercase lg:text-sm">
                Asset price total: {money(collection.assetPriceTotal)}
              </span>
            </p>
            <p className="mt-2 flex items-center gap-2">
              <TrendingUp
                aria-hidden="true"
                className="h-4 w-4 text-amber-600"
              />
              <span className="font-grotesk text-xs text-neutral-700 uppercase lg:text-sm">
                Completed sales: {money(collection.completedSalesVolume)}
              </span>
            </p>
          </aside>
        </div>
        <section
          aria-label="Filter collection assets"
          className="relative mt-10 flex w-full flex-col gap-2 lg:mt-20"
        >
          <div
            className={
              owner
                ? "grid w-full grid-cols-[minmax(0,1fr)_max-content] items-center justify-between gap-y-2 md:grid-cols-[max-content_minmax(0,1fr)_max-content] md:gap-x-5"
                : "flex w-full flex-col items-start gap-2"
            }
          >
            {owner && (
              <button
                type="button"
                onClick={() => setAssetPickerOpen(true)}
                className="font-bebas col-start-1 row-start-1 inline-flex w-fit items-center justify-center gap-1 rounded-md border !border-[#666666] bg-[#1E3A8A] px-2 py-1 text-sm font-normal tracking-wider whitespace-nowrap text-white transition-all duration-300 hover:scale-105 active:scale-95 lg:px-3 lg:py-2 lg:text-base"
              >
                <ImagePlus className="h-3.5 w-3.5 lg:h-5 lg:w-5" />
                Add assets
              </button>
            )}
            <div
              className={`scrollbar-hide w-full min-w-0 overflow-x-auto ${owner ? "col-span-2 row-start-2 md:col-span-1 md:col-start-2 md:row-start-1 md:w-auto" : ""}`}
            >
              <div className="flex min-w-fit items-center gap-2 px-1">
                {(categoriesQuery.data?.data ?? []).map((category) => {
                  const selected = selectedCategories.includes(category);
                  return (
                    <button
                      key={category}
                      type="button"
                      aria-pressed={selected}
                      onClick={() =>
                        setSelectedCategories((current) =>
                          selected
                            ? current.filter((item) => item !== category)
                            : [...current, category],
                        )
                      }
                      className={`font-bebas group inline-flex w-fit flex-shrink-0 rounded-md border !border-[#666666] px-2 py-1 text-sm font-normal tracking-wider text-nowrap capitalize transition-all duration-300 hover:scale-105 active:scale-95 lg:px-3 lg:py-2 lg:text-base ${selected ? "bg-[#1E3A8A] text-white" : "text-neutral-600"}`}
                    >
                      {category}
                    </button>
                  );
                })}
                {categoriesQuery.isError && (
                  <p className="font-bebas text-sm tracking-wider text-red-600">
                    Categories could not be loaded.
                  </p>
                )}
              </div>
            </div>
            <div
              className={
                owner
                  ? "col-start-2 row-start-1 justify-self-end md:col-start-3 md:row-start-1"
                  : "flex w-full items-center justify-between"
              }
            >
              {!owner && hasActiveAssetFilters && (
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategories([]);
                    setAvailabilityFilter(null);
                    setDateSort(null);
                    setPriceTier(null);
                  }}
                  className="font-bebas min-h-9 rounded-lg px-2 text-sm tracking-wider text-blue-800 underline underline-offset-2"
                >
                  Clear all
                </button>
              )}
              <button
                type="button"
                aria-expanded={filtersOpen}
                onClick={() => setFiltersOpen((open) => !open)}
                className={`font-bebas flex w-fit items-center justify-center gap-1 rounded-md border !border-[#666666] bg-[#1E3A8A] px-2 py-1 text-sm font-normal tracking-wider whitespace-nowrap text-white transition-all duration-300 hover:scale-105 active:scale-95 lg:px-3 lg:py-2 lg:text-base ${owner ? "" : "ml-auto"}`}
              >
                <SlidersHorizontal
                  className="h-3.5 w-3.5 text-white lg:h-5 lg:w-5"
                  aria-hidden="true"
                />
                Filter
              </button>
            </div>
          </div>
          {owner && hasActiveAssetFilters && (
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => {
                  setSelectedCategories([]);
                  setAvailabilityFilter(null);
                  setDateSort(null);
                  setPriceTier(null);
                }}
                className="font-bebas min-h-9 rounded-lg px-2 text-sm tracking-wider text-blue-800 underline underline-offset-2"
              >
                Clear all
              </button>
            </div>
          )}

          {/* Filters and sorting */}
          <AnimatePresence initial={false}>
            {filtersOpen && (
              <motion.div
                key="collection-filters"
                initial={{ opacity: 0, height: 0, y: -12 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.28, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <motion.div className="scrollbar-hide flex w-full flex-row items-start justify-between gap-6 overflow-x-auto py-1">
                  <motion.fieldset
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, x: 12 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.22 },
                      },
                    }}
                    className="flex flex-shrink-0 flex-col items-start"
                  >
                    <legend className="font-grotesk mb-2 text-sm font-semibold text-neutral-800">
                      Availability
                    </legend>
                    <div className="flex items-center gap-[3px] sm:gap-2">
                      {[
                        { label: "For Sale", value: true },
                        { label: "Not For Sale", value: false },
                      ].map(({ label, value }) => (
                        <button
                          key={label}
                          type="button"
                          aria-pressed={availabilityFilter === value}
                          onClick={() =>
                            setAvailabilityFilter((current) =>
                              current === value ? null : value,
                            )
                          }
                          className={`font-bebas flex flex-shrink-0 items-center rounded-lg px-2.5 py-2 text-xs tracking-wider whitespace-nowrap transition-all duration-300 sm:text-sm ${availabilityFilter === value ? "bg-[#1E3A8A] text-white" : "bg-neutral-300 text-neutral-800 hover:bg-neutral-400"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.fieldset>
                  <motion.fieldset
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, x: 12 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.22 },
                      },
                    }}
                    className="flex flex-shrink-0 flex-col items-start"
                  >
                    <legend className="font-grotesk mb-2 text-sm font-semibold text-neutral-800">
                      Date added
                    </legend>
                    <div className="flex items-center gap-[3px] sm:gap-2">
                      {[
                        { label: "Latest", value: "latest" },
                        { label: "Oldest", value: "oldest" },
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={dateSort === value}
                          onClick={() =>
                            setDateSort((current) =>
                              current === value
                                ? null
                                : (value as "latest" | "oldest"),
                            )
                          }
                          className={`font-bebas flex flex-shrink-0 items-center rounded-lg px-2.5 py-2 text-xs tracking-wider whitespace-nowrap transition-all duration-300 sm:text-sm ${dateSort === value ? "bg-[#1E3A8A] text-white" : "bg-neutral-300 text-neutral-800 hover:bg-neutral-400"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.fieldset>
                  <motion.fieldset
                    initial="hidden"
                    animate="visible"
                    variants={{
                      hidden: { opacity: 0, x: 12 },
                      visible: {
                        opacity: 1,
                        x: 0,
                        transition: { duration: 0.22 },
                      },
                    }}
                    className="flex flex-shrink-0 flex-col items-start"
                  >
                    <legend className="font-grotesk mb-2 text-sm font-semibold text-neutral-800">
                      Price
                    </legend>
                    <div className="flex items-center gap-[3px] sm:gap-2">
                      {[
                        { label: "$50–$500", value: "middle" },
                        { label: "Over $500–under $1,500", value: "high" },
                        { label: "$1,500 or more", value: "premium" },
                      ].map(({ label, value }) => (
                        <button
                          key={value}
                          type="button"
                          aria-pressed={priceTier === value}
                          onClick={() =>
                            setPriceTier((current) =>
                              current === value
                                ? null
                                : (value as "middle" | "high" | "premium"),
                            )
                          }
                          className={`font-bebas flex flex-shrink-0 items-center rounded-lg px-2.5 py-2 text-xs tracking-wider whitespace-nowrap transition-all duration-300 sm:text-sm ${priceTier === value ? "bg-[#1E3A8A] text-white" : "bg-neutral-300 text-neutral-800 hover:bg-neutral-400"}`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </motion.fieldset>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </section>

        {removeAsset.isError && (
          <p
            role="alert"
            className="font-bebas mt-4 text-sm tracking-wider text-red-600"
          >
            Could not remove this asset from the collection. Please try again.
          </p>
        )}

        {/* Asset Grid */}
        {visibleAssets.length ? (
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleAssets.map((asset) => (
              <article key={asset.fileId} className="relative min-w-0">
                {owner && (
                  <div className="absolute top-3 left-3 z-20">
                    <CollectionAssetActionsToggle
                      assetId={asset.fileId}
                      assetTitle={asset.artTitle}
                      disabled={removeAsset.isPending}
                      onEdit={() => editCollectionAsset(asset)}
                      onRemove={() =>
                        removeCollectionAsset(asset.fileId, asset.artTitle)
                      }
                    />
                  </div>
                )}
                <button
                  type="button"
                  onClick={() => openAssetDetails(asset)}
                  aria-label={`View details for ${asset.artTitle}`}
                  className="artwork-oak-frame group relative block w-full cursor-pointer border-0 text-left shadow-lg transition-transform duration-300 hover:-translate-y-0.5 focus-visible:ring-2 focus-visible:ring-blue-700 focus-visible:outline-none active:scale-[0.99]"
                >
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
                </button>
                <div className="flex items-center justify-between gap-3 p-3">
                  <div>
                    <h2 className="font-helvetica font-semibold">
                      {asset.artTitle}
                    </h2>
                    <p className="font-grotesk text-xs font-light text-neutral-500 uppercase">
                      {money(asset.artPrice)}
                    </p>
                  </div>
                  <CollectionAssetLikeButton
                    assetId={asset.fileId}
                    artTitle={asset.artTitle}
                    initialLikeCount={asset.numOfLikes}
                  />
                </div>
              </article>
            ))}
          </div>
        ) : collection.assetData.length ? (
          <p className="font-bebas py-16 text-center tracking-wider text-neutral-500">
            No assets match these filters.
          </p>
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
      {owner && editingAsset && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-white">
          <UploadCanvas
            key={editingAsset.fileId}
            mode="edit"
            asset={editingAsset}
            onCancel={() => setEditingAsset(null)}
            onComplete={() => {
              setEditingAsset(null);
              void collectionQuery.refetch();
            }}
          />
        </div>
      )}
      <ArtDetails />
    </main>
  );
}
