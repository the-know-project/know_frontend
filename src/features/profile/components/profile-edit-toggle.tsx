"use client";

import {
  IconArrowRightCircleFilled,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ProfileToggleData } from "../data/profile.data";
import {
  useToggleEditProfile,
  useIsEditProfileToggled,
} from "../artist/store/artist-profile.store";

interface IProfileEditToggle {
  id: string;
  role?: string;
  userId?: string;
  postId?: string; // For post-specific actions
  onEdit?: () => void;
  onShare?: () => void;
  onUnpublish?: () => void;
  onDelete?: () => void;
}

const ProfileEditToggle: React.FC<IProfileEditToggle> = ({
  id,
  role,
  userId,
  postId,
  onEdit,
  onShare,
  onUnpublish,
  onDelete,
}) => {
  const router = useRouter();
  const toggleEditProfile = useToggleEditProfile();
  const isEditProfileToggled = useIsEditProfileToggled(id);
  const [editToggled, setEditToggled] = useState(false);
  const toggleRef = useRef<HTMLDivElement>(null);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleEdit = () => {
    setEditToggled((prev) => !prev);
    toggleEditProfile(id);
  };

  const handleMenuItemClick = (itemName: string) => {
    setEditToggled(false);

    // Handle different menu items based on name
    switch (itemName.toLowerCase()) {
      case "edit post":
        if (onEdit) {
          onEdit();
        } else if (postId) {
          router.push(`/post/edit/${postId}`);
        }
        break;

      case "share":
        if (onShare) {
          onShare();
        } else {
          // Default share logic
          handleShare();
        }
        break;

      case "unpublish":
        if (onUnpublish) {
          onUnpublish();
        }
        break;

      case "delete":
        if (onDelete) {
          onDelete();
        } else {
          handleDelete();
        }
        break;

      default:
        console.log(`Clicked: ${itemName}`);
    }
  };

  const handleShare = () => {
    if (navigator.share && postId) {
      navigator
        .share({
          title: "Check out this post",
          url: `${window.location.origin}/post/${postId}`,
        })
        .catch((error) => console.log("Error sharing:", error));
    } else {
      // Fallback: copy to clipboard
      const url = `${window.location.origin}/post/${postId}`;
      navigator.clipboard.writeText(url);
      alert("Link copied to clipboard!");
    }
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (confirmed && postId) {
      // Call delete API here
      console.log("Deleting post:", postId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        toggleRef.current &&
        !toggleRef.current.contains(event.target as Node)
      ) {
        setEditToggled(false);
        if (isEditProfileToggled) {
          toggleEditProfile(id);
        }
      }
    };

    if (editToggled) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [editToggled, isEditProfileToggled, id, toggleEditProfile]);

  return (
    <section className="flex w-full flex-col">
      <div ref={toggleRef} className="relative flex flex-col gap-1">
        <button
          onClick={toggleEdit}
          type="button"
          className="flex w-full max-w-[90px] touch-manipulation flex-row items-center gap-[24px] rounded-[36px] bg-white px-4 py-2 opacity-25 shadow-sm backdrop-blur-md hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 active:opacity-100"
        >
          <IconSettingsFilled color="black" width={20} height={20} />
          <IconArrowRightCircleFilled
            color="black"
            width={20}
            height={20}
            className={`${
              editToggled
                ? "rotate-90 transition-transform duration-300"
                : "transition-transform duration-300"
            }`}
          />
        </button>

        <div className="absolute z-50 flex w-full px-4 pt-2">
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
                <div className="flex w-[138px] touch-manipulation flex-col gap-[8px] rounded-[9px] bg-[#F4F4F4] px-4 pt-[12px] pb-[12px] opacity-75 shadow-lg sm:gap-[16px]">
                  {ProfileToggleData.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(item.name)}
                      style={{
                        animationDelay: `${index * 100}ms`,
                      }}
                      className="motion-preset-blur-down motion-duration-700 motion-delay-100 group flex w-full flex-col items-start"
                    >
                      <p className="font-bricolage text-[12px] font-semibold text-black transition-all duration-200 group-hover:scale-105 group-active:scale-95 sm:text-sm">
                        {item.name}
                      </p>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProfileEditToggle;
