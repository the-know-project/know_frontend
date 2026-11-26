"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Check, ImagePlus, X } from "lucide-react";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { useAddAssetToCollection } from "../hooks/use-add-asset-to-collection";
import { useArtistAssets } from "../hooks/use-artist-assets";

interface Props {
  artistId: string;
  collectionId: string;
  existingAssetIds: string[];
  onClose: () => void;
}

export default function AssetPickerDialog({
  artistId,
  collectionId,
  existingAssetIds,
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const assetsQuery = useArtistAssets(artistId);
  const addAsset = useAddAssetToCollection();
  const assets =
    assetsQuery.data?.pages.flatMap((page) => page.data.items) ?? [];
  const existingIds = new Set(existingAssetIds);

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !addAsset.isPending) onClose();
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [addAsset.isPending, onClose]);

  const toggleAsset = (fileId: string) => {
    setSelectedAssetIds((selected) =>
      selected.includes(fileId)
        ? selected.filter((id) => id !== fileId)
        : [...selected, fileId],
    );
  };

  const handleAddSelected = async () => {
    const assetsToAdd = selectedAssetIds.filter(
      (fileId) => !existingIds.has(fileId),
    );
    if (!assetsToAdd.length) {
      onClose();
      return;
    }

    const toastId = toast.loading("Adding selected assets to collection", {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });
    let addedCount = 0;

    try {
      for (const fileId of assetsToAdd) {
        await addAsset.mutateAsync({ collectionId, fileId });
        addedCount++;
      }
      toast.success("Assets added to collection", {
        id: toastId,
        icon: <ToastIcon />,
        description: (
          <ToastDescription
            description={`${addedCount} ${addedCount === 1 ? "asset" : "assets"} added to your collection.`}
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
      onClose();
    } catch (error) {
      toast("Could not add assets to collection", {
        id: toastId,
        icon: <ToastIcon />,
        description: (
          <ToastDescription
            description={`${addedCount ? `${addedCount} ${addedCount === 1 ? "asset was" : "assets were"} added before another asset failed. ` : ""}${error instanceof Error ? error.message : "Please try again."}`}
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
      // React Query's mutation state renders the failure message below.
    }
  };

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[140] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onMouseDown={(event) => {
          if (event.target === event.currentTarget && !addAsset.isPending)
            onClose();
        }}
      >
        <motion.section
          role="dialog"
          aria-modal="true"
          aria-label="Choose assets to add to this collection"
          className="flex max-h-[88vh] w-full max-w-4xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <header className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font-helvetica text-lg font-semibold">
                Add assets
              </h2>
              <p className="font-grotesk mt-1 text-sm text-neutral-500">
                Select the artworks you want in this collection.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close"
              disabled={addAsset.isPending}
              onClick={onClose}
              className="rounded-full p-2 hover:bg-neutral-100 disabled:opacity-50"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="min-h-0 flex-1 overflow-y-auto p-5">
            {assetsQuery.isLoading && (
              <p className="font-bebas py-12 text-center text-sm tracking-wider text-neutral-500">
                Loading your artworks…
              </p>
            )}
            {assetsQuery.isError && (
              <div className="py-10 text-center">
                <p className="font-bebas text-sm tracking-wider text-red-600">
                  Could not load your artworks.
                </p>
                <button
                  type="button"
                  onClick={() => void assetsQuery.refetch()}
                  className="mt-2 text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}
            {!assetsQuery.isLoading &&
              !assetsQuery.isError &&
              assets.length === 0 && (
                <div className="py-12 text-center">
                  <ImagePlus className="mx-auto h-8 w-8 text-neutral-400" />
                  <p className="font-bebas mt-3 text-sm tracking-wider text-neutral-600">
                    You haven’t uploaded any artworks yet.
                  </p>
                </div>
              )}
            {assets.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {assets.map((asset) => {
                  const alreadyAdded = existingIds.has(asset.fileId);
                  const selected = selectedAssetIds.includes(asset.fileId);
                  return (
                    <button
                      key={asset.fileId}
                      type="button"
                      disabled={alreadyAdded || addAsset.isPending}
                      aria-pressed={selected || alreadyAdded}
                      onClick={() => toggleAsset(asset.fileId)}
                      className={`group relative overflow-hidden rounded-xl border text-left transition ${alreadyAdded ? "cursor-not-allowed opacity-55" : selected ? "border-blue-800 ring-2 ring-blue-800" : "border-neutral-200 hover:border-neutral-400"}`}
                    >
                      <div className="relative aspect-square bg-neutral-100">
                        {asset.url && (
                          <Image
                            src={asset.highResUrl || asset.url}
                            alt={asset.name}
                            fill
                            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                            className="object-cover"
                          />
                        )}
                        {(selected || alreadyAdded) && (
                          <span className="absolute top-2 right-2 flex h-7 w-7 items-center justify-center rounded-full bg-blue-800 text-white">
                            {alreadyAdded ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Check className="h-4 w-4" />
                            )}
                          </span>
                        )}
                      </div>
                      <span className="font-grotesk block truncate p-2 text-sm font-medium capitalize">
                        {asset.name}
                      </span>
                      {alreadyAdded && (
                        <span className="font-grotesk absolute inset-x-0 bottom-10 bg-black/60 px-2 py-1 text-center text-xs text-white">
                          Already in collection
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
            {assetsQuery.hasNextPage && (
              <button
                type="button"
                disabled={assetsQuery.isFetchingNextPage || addAsset.isPending}
                onClick={() => void assetsQuery.fetchNextPage()}
                className="mt-5 w-full rounded-lg py-3 text-sm text-neutral-600 hover:bg-neutral-50"
              >
                {assetsQuery.isFetchingNextPage
                  ? "Loading…"
                  : "Load more artworks"}
              </button>
            )}
            {addAsset.isError && (
              <p
                role="alert"
                className="font-bebas mt-4 text-center text-sm tracking-wider text-red-600"
              >
                One or more artworks could not be added. Try again.
              </p>
            )}
          </div>
          <footer className="flex items-center justify-between border-t p-4">
            <span className="font-grotesk text-sm text-neutral-500">
              {selectedAssetIds.length} selected
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={addAsset.isPending}
                onClick={onClose}
                className="font-bebas rounded-lg border px-4 py-2 text-sm tracking-wider"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!selectedAssetIds.length || addAsset.isPending}
                onClick={() => void handleAddSelected()}
                className="font-bebas rounded-lg bg-[#1E3A8A] px-4 py-2 text-sm font-medium tracking-wider text-white disabled:opacity-50"
              >
                {addAsset.isPending ? "Adding…" : "Add selected"}
              </button>
            </div>
          </footer>
        </motion.section>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
