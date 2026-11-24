"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Folder, Plus, X } from "lucide-react";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { useAddAssetToCollection } from "../hooks/use-add-asset-to-collection";
import { useArtistCollections } from "../hooks/use-artist-collections";

interface Props {
  artistId: string;
  fileId: string;
  onClose: () => void;
}

export default function CollectionPickerDialog({
  artistId,
  fileId,
  onClose,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const [selectedCollectionId, setSelectedCollectionId] = useState<
    string | null
  >(null);
  const collectionsQuery = useArtistCollections(artistId);
  const addAsset = useAddAssetToCollection();
  const collections =
    collectionsQuery.data?.pages.flatMap((page) => page.data.items) ?? [];

  useEffect(() => setMounted(true), []);
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", keydown);
    return () => document.removeEventListener("keydown", keydown);
  }, [onClose]);

  if (!mounted) return null;
  return createPortal(
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[130] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm"
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
          aria-label="Add artwork to a collection"
          className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl"
          initial={{ opacity: 0, y: 16, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10 }}
        >
          <header className="flex items-center justify-between border-b p-5">
            <div>
              <h2 className="font helvetica text-lg font-semibold">
                Add to collection
              </h2>
              <p className="font-grotesk mt-1 text-sm text-neutral-500">
                Choose one of your collections for this artwork.
              </p>
            </div>

            <button
              type="button"
              aria-label="Close"
              onClick={onClose}
              className="rounded-full p-2 hover:bg-neutral-100"
            >
              <X className="h-5 w-5" />
            </button>
          </header>
          <div className="max-h-[60vh] space-y-2 overflow-y-auto p-4">
            {collectionsQuery.isLoading && (
              <p className="font-bebas py-8 text-center text-sm tracking-wider text-neutral-500">
                Loading collections…
              </p>
            )}
            {collectionsQuery.isError && (
              <div className="py-6 text-center">
                <p className="font-bebas text-sm tracking-wider text-red-600">
                  Could not load your collections.
                </p>
                <button
                  type="button"
                  onClick={() => void collectionsQuery.refetch()}
                  className="mt-2 text-sm underline"
                >
                  Try again
                </button>
              </div>
            )}
            {!collectionsQuery.isLoading &&
              !collectionsQuery.isError &&
              collections.length === 0 && (
                <p className="font-bebas py-6 text-center text-sm tracking-wider text-neutral-500">
                  You haven’t created a collection yet.
                </p>
              )}
            {collections.map((collection) => (
              <button
                key={collection.id}
                type="button"
                disabled={addAsset.isPending}
                onClick={() => {
                  setSelectedCollectionId(collection.id);
                  const toastId = toast.loading(
                    `Adding asset to collection: ${collection.title}`,
                    {
                      style: {
                        backgroundColor: "oklch(62.7% 0.194 149.214)",
                        fontSize: "12px",
                        fontFamily: "Space Grotesk",
                        color: "#ffffff",
                        fontWeight: "600",
                      },
                    },
                  );
                  addAsset.mutate(
                    { collectionId: collection.id, fileId },
                    {
                      onSuccess: () => {
                        toast.success("Asset added to collection", {
                          id: toastId,
                          icon: <ToastIcon />,
                          description: (
                            <ToastDescription
                              description={`Added to “${collection.title}”.`}
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
                      },
                      onError: (error) => {
                        toast("Could not add asset to collection", {
                          id: toastId,
                          icon: <ToastIcon />,
                          description: (
                            <ToastDescription
                              description={
                                error instanceof Error
                                  ? error.message
                                  : "Please try again."
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
                }}
                className="flex w-full items-center gap-3 rounded-xl border border-neutral-200 p-3 text-left transition hover:bg-neutral-50 disabled:opacity-60"
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-lg bg-neutral-100 text-neutral-500">
                  <Folder className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="font-helvetica block truncate font-medium">
                    {collection.title}
                  </span>
                  <span className="font-grotesk text-sm text-neutral-500 capitalize">
                    {collection.assetCount ?? 0} assets
                  </span>
                </span>
                <span className="font-grotesk text-sm text-neutral-500">
                  {selectedCollectionId === collection.id && addAsset.isPending
                    ? "Adding…"
                    : "Add"}
                </span>
              </button>
            ))}
            {collectionsQuery.hasNextPage && (
              <button
                type="button"
                disabled={collectionsQuery.isFetchingNextPage}
                onClick={() => void collectionsQuery.fetchNextPage()}
                className="font-bebas w-full rounded-lg py-3 text-sm tracking-wider text-neutral-600 hover:bg-neutral-50"
              >
                {collectionsQuery.isFetchingNextPage
                  ? "Loading…"
                  : "Load more collections"}
              </button>
            )}
            {addAsset.isError && (
              <p
                role="alert"
                className="font-bebas text-center text-sm tracking-wider text-red-600"
              >
                Could not add this artwork. It may already be in the collection.
              </p>
            )}
          </div>
          <footer className="border-t p-4">
            <Link
              href="/collections/new"
              onClick={onClose}
              className="font-bebas inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#1E3A8A] px-4 py-2 text-sm font-medium tracking-wider text-white transition-all hover:scale-105 active:scale-90"
            >
              <Plus className="h-4 w-4" />
              Create a collection
            </Link>
          </footer>
        </motion.section>
      </motion.div>
    </AnimatePresence>,
    document.body,
  );
}
