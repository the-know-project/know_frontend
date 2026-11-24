"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ProfileToggleData } from "../data/profile.data";
import { Settings2Icon } from "lucide-react";
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
  const toggleRef = useRef<HTMLDivElement>(null);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleEdit = () => {
    setEditToggled((prev) => !prev);
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

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === "1") {
      onEditPost?.();
      setEditToggled(false);
    }
    if (itemId === "4") {
      void handleDeleteAsset();
      setEditToggled(false);
    }
    if (itemId === "5") {
      onAddToCollection?.();
      setEditToggled(false);
    }
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
      <div ref={toggleRef} className="relative flex flex-col gap-1">
        <button
          onClick={toggleEdit}
          type="button"
          aria-label="Open artwork actions"
          aria-expanded={editToggled}
          className="flex min-h-10 min-w-10 touch-manipulation flex-row items-center justify-center rounded-xl border border-white/20 bg-neutral-950/85 p-2.5 text-white shadow-lg backdrop-blur-md transition-colors hover:bg-neutral-800 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-none active:bg-neutral-700"
        >
          <Settings2Icon className="h-4 w-4 text-white" />
        </button>
        <div className="absolute top-10 flex w-full px-4">
          <AnimatePresence>
            {editToggled && (
              <motion.div
                variants={variants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                transition={{
                  delay: 0.05,
                  ease: "easeInOut",
                  duration: 0.3,
                }}
              >
                <div className="flex w-fit touch-manipulation flex-col items-start gap-1 rounded-[15px] bg-white/30 p-2 text-nowrap shadow-sm backdrop-blur-md">
                  {ProfileToggleData.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(String(item.id))}
                      className="group flex w-full flex-col items-start"
                    >
                      <p className="font-grotesk text-sm font-medium text-neutral-50 transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                        {item.name}
                      </p>
                    </button>
                  ))}
                  {isListed ? (
                    <button
                      disabled={!isListed}
                      onClick={handleUnlistAsset}
                      className="font-grotesk text-sm font-medium text-neutral-50 capitalize transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      Unlist
                    </button>
                  ) : (
                    <button
                      disabled={isListed}
                      onClick={handleListToggle}
                      className="font-grotesk text-sm font-medium text-neutral-50 capitalize transition-all duration-200 hover:scale-105 active:scale-95"
                    >
                      list
                    </button>
                  )}
                </div>
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
      </div>
    </section>
  );
};

export default ProfileEditToggle;
