"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  Check,
  Ellipsis,
  FolderPlus,
  Pencil,
  Store,
  Trash2,
  X,
} from "lucide-react";
import ListAssetModal from "./list-asset-modal";
import { useUnlistAsset } from "../artist/hooks/use-unlist-asset";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";
import { useDeleteAsset } from "../artist/hooks/use-delete-asset";

interface IProfileEditToggle {
  id: string;

  image: string;
  isListed: boolean;
  onEditPost?: () => void;
  onAddToCollection?: () => void;
}

const ProfileEditToggle: React.FC<IProfileEditToggle> = ({
  image,
  id,
  isListed,
  onEditPost,
  onAddToCollection,
}) => {
  const { mutateAsync: unlistAsset } = useUnlistAsset();
  const { mutateAsync: deleteAsset } = useDeleteAsset();
  const [editToggled, setEditToggled] = useState(false);
  const [isListModalToggled, setIsListModalToggled] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);

  const toggleEdit = () => {
    if (editToggled) setConfirmDelete(false);
    setEditToggled(!editToggled);
  };

  const handleUnlistAsset = async () => {
    const unListingToastId = toast.loading("Unlisting Asset", {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });

    const data = await unlistAsset(id);

    if (data.status === 200) {
      toast.success("Asset unlisted from sale successfully", {
        id: unListingToastId,
        icon: <ToastIcon />,
        description: (
          <ToastDescription description="Your asset has been unlisted successfully." />
        ),
        style: {
          backgroundColor: "oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
    } else {
      toast.error("Failed to unlist asset", {
        id: unListingToastId,
        icon: <ToastIcon />,
        description: (
          <ToastDescription description="There was an error unlisting your asset. Please try again." />
        ),
        style: {
          backgroundColor: "oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
    }
  };

  const handleListToggle = () => {
    setIsListModalToggled((prev) => !prev);
    setEditToggled(false);
  };

  const handleDeleteAsset = async () => {
    const deletingToastId = toast.loading("Deleting Asset", {
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "12px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });

    const result = await deleteAsset({ fileId: id });

    if (result instanceof Error) {
      toast.error("Failed to delete asset", {
        id: deletingToastId,
        icon: <ToastIcon />,
        description: (
          <ToastDescription description="There was an error deleting your asset. Please try again." />
        ),
        style: {
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
      return;
    }

    toast.success("Asset deleted successfully", {
      id: deletingToastId,
      icon: <ToastIcon />,
      description: (
        <ToastDescription description="Your asset has been deleted successfully." />
      ),
      style: {
        backgroundColor: "oklch(62.7% 0.194 149.214)",
        fontSize: "15px",
        fontFamily: "Space Grotesk",
        color: "#ffffff",
        fontWeight: "600",
      },
    });
  };

  const closeMenu = () => {
    setEditToggled(false);
    setConfirmDelete(false);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setEditToggled(false);
      }
    };

    if (editToggled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editToggled]);

  return (
    <section className="flex w-full flex-col">
      <div
        ref={toggleRef}
        className="relative"
        onKeyDown={(event) => {
          if (event.key === "Escape") closeMenu();
        }}
      >
        <button
          onClick={toggleEdit}
          type="button"
          aria-label={
            editToggled ? "Close artwork actions" : "Open artwork actions"
          }
          aria-expanded={editToggled}
          aria-controls={`artwork-actions-${id}`}
          className="group flex h-10 w-10 touch-manipulation items-center justify-center rounded-full border border-white/70 bg-neutral-950/75 text-white shadow-lg shadow-black/20 backdrop-blur-md transition duration-200 hover:scale-105 hover:bg-neutral-900 focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-black/20 focus-visible:outline-none active:scale-95"
        >
          <Ellipsis className="h-5 w-5 transition-transform group-hover:rotate-90" />
        </button>
        <AnimatePresence>
          {editToggled && (
            <motion.div
              id={`artwork-actions-${id}`}
              aria-label="Artwork actions"
              initial={{ opacity: 0, y: 8, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 6, scale: 0.98 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
              className="absolute top-12 left-0 z-40 w-60 origin-top-left overflow-hidden rounded-2xl border border-neutral-200/80 bg-white/95 p-1.5 text-neutral-900 shadow-2xl shadow-black/20 backdrop-blur-xl"
            >
              <div className="flex items-center justify-between px-3 pt-2 pb-2">
                <div>
                  <p className="font-bebas text-xs tracking-[0.12em] text-neutral-500 uppercase">
                    Artwork actions
                  </p>
                  <p className="font-grotesk mt-0.5 text-[11px] text-neutral-400">
                    Manage your artwork
                  </p>
                </div>
                <span
                  className={`font-bebas rounded-full px-2 py-1 text-[10px] tracking-wider ${
                    isListed
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-neutral-100 text-neutral-500"
                  }`}
                >
                  {isListed ? "Listed" : "Unlisted"}
                </span>
              </div>

              <div className="space-y-0.5">
                <button
                  type="button"
                  onClick={() => {
                    onEditPost?.();
                    closeMenu();
                  }}
                  className="font-grotesk flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                >
                  <Pencil className="h-4 w-4 text-neutral-500" />
                  <span>Edit artwork</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    onAddToCollection?.();
                    closeMenu();
                  }}
                  className="font-grotesk flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                >
                  <FolderPlus className="h-4 w-4 text-neutral-500" />
                  <span>Add to collection</span>
                </button>
                <button
                  type="button"
                  onClick={async () => {
                    if (isListed) await handleUnlistAsset();
                    else handleListToggle();
                    closeMenu();
                  }}
                  className="font-grotesk flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium transition-colors hover:bg-neutral-100 focus-visible:bg-neutral-100 focus-visible:outline-none"
                >
                  <Store className="h-4 w-4 text-neutral-500" />
                  <span>{isListed ? "Unlist from sale" : "List for sale"}</span>
                  {isListed && (
                    <Check className="ml-auto h-3.5 w-3.5 text-emerald-600" />
                  )}
                </button>
              </div>

              <div className="my-1.5 border-t border-neutral-100" />

              {confirmDelete ? (
                <div className="space-y-2 rounded-xl bg-red-50 p-3">
                  <p className="font-bebas text-xs font-semibold tracking-wider text-red-800">
                    Delete this artwork?
                  </p>
                  <p className="font-grotesk text-[11px] leading-4 text-red-700">
                    This action cannot be undone.
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
                        void handleDeleteAsset();
                        closeMenu();
                      }}
                      className="font-bebas flex min-h-9 flex-1 items-center justify-center gap-1 rounded-lg bg-red-600 text-xs font-semibold tracking-wider text-white transition-colors hover:bg-red-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Delete
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="font-grotesk flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete artwork</span>
                </button>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {isListModalToggled && (
          <ListAssetModal
            fileId={id}
            image={image}
            isOpen={isListModalToggled}
            onClose={handleListToggle}
          />
        )}
      </div>
    </section>
  );
};

export default ProfileEditToggle;
