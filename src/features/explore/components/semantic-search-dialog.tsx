"use client";

import { BlankProfilePicture } from "@/src/constants/constants";
import { useToggleExploreContent } from "../state/explore-content.store";
import { IExploreContent } from "@/src/shared/hooks/interface/shared.interface";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { SemanticSearchAsset } from "../types/semantic-search.types";
import { X } from "lucide-react";

interface SemanticSearchDialogProps {
  query: string;
  open: boolean;
  onClose: () => void;
  results: SemanticSearchAsset[];
  isLoading: boolean;
  error: Error | null;
}

const toExploreContent = (asset: SemanticSearchAsset): IExploreContent => ({
  id: asset.fileId,
  userId: asset.userId ?? "",
  creatorProfileUrl: asset.imageUrl || BlankProfilePicture,
  creatorName:
    [asset.firstName, asset.lastName].filter(Boolean).join(" ") || "Artist",
  artName: asset.fileName,
  description: asset.description,
  artWorkUrl: asset.url,
  highResUrl: asset.highResUrl || asset.url,
  extraUrls: asset.extraUrls,
  highResExtraUrls: asset.highResExtraUrls || asset.extraUrls,
  categories: asset.categories || [],
  tags: asset.tags,
  price: asset.price ?? 0,
  quantity: asset.quantity,
  size: asset.size || {},
  numOfLikes: asset.numOfLikes || 0,
  numOfViews: asset.numOfViews || 0,
  numOfComments: 0,
  isListed: Boolean(asset.isListed),
  createdAt: asset.createdAt ? new Date(asset.createdAt) : new Date(),
});

const SemanticSearchDialog = ({
  query,
  open,
  onClose,
  results,
  isLoading,
  error,
}: SemanticSearchDialogProps) => {
  const toggleExploreContent = useToggleExploreContent();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (!open) return;
    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  const openDetails = (asset: SemanticSearchAsset) => {
    toggleExploreContent(asset.fileId, toExploreContent(asset));
    onClose();
  };

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/30 px-3 py-6 backdrop-blur-md sm:px-6"
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
            aria-label={`Search results for ${query}`}
            className="max-h-[84vh] w-full max-w-4xl overflow-hidden rounded-2xl bg-white shadow-[0_24px_100px_rgba(0,0,0,0.35)] ring-1 ring-black/10"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
          >
            <header className="flex items-center justify-between border-b px-5 py-4">
              <div>
                <p className="font-bebas text-xs tracking-widest text-neutral-500 uppercase">
                  Artwork search
                </p>
                <h2 className="font-grotesk text-lg font-semibold text-neutral-900">
                  “{query}”
                </h2>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-3 py-1 text-sm text-neutral-600 hover:bg-neutral-100"
                aria-label="Close search results"
              >
                <X className="h-4 w-4" />
              </button>
            </header>
            <div className="max-h-[calc(84vh-76px)] overflow-y-auto p-4 sm:p-5">
              {isLoading ? (
                <p
                  className="font-bebas py-12 text-center text-sm tracking-wider text-neutral-500"
                  role="status"
                >
                  Finding artwork…
                </p>
              ) : error ? (
                <div className="py-12 text-center">
                  <p className="font-bebas text-sm tracking-wider text-red-600">
                    Search couldn’t be completed.
                  </p>
                  <button
                    type="button"
                    onClick={onClose}
                    className="mt-3 text-sm underline"
                  >
                    Close
                  </button>
                </div>
              ) : results.length === 0 ? (
                <p className="py-12 text-center text-sm text-neutral-500">
                  No artwork matched this search.
                </p>
              ) : (
                <ul className="grid gap-3 sm:grid-cols-2">
                  {results.map((asset) => (
                    <li key={asset.fileId}>
                      <button
                        type="button"
                        onClick={() => openDetails(asset)}
                        className="flex w-full gap-3 rounded-xl border border-neutral-200 p-2 text-left transition hover:border-neutral-400 hover:bg-neutral-50 focus-visible:outline-2 focus-visible:outline-offset-2"
                      >
                        <img
                          src={asset.url}
                          alt=""
                          className="h-24 w-24 shrink-0 rounded-lg bg-neutral-100 object-cover"
                        />
                        <span className="min-w-0 py-1">
                          <span className="font-helvetica block truncate text-neutral-900">
                            {asset.fileName}
                          </span>
                          <span className="font-grotesk mt-1 block text-sm text-neutral-700 uppercase">
                            {asset.formattedPrice ?? "Price unavailable"}
                          </span>
                          <span className="font-bebas mt-1 block truncate text-xs tracking-wider text-neutral-500">
                            {[
                              ...(asset.categories || []),
                              ...(asset.tags || []),
                            ].join(" · ") || "Artwork"}
                          </span>
                          {asset.similarity != null && (
                            <span className="font-grotesk mt-1 block text-xs text-neutral-400 uppercase">
                              {Math.round(asset.similarity * 100)}% relevance
                            </span>
                          )}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.section>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default SemanticSearchDialog;
