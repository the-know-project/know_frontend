"use client";
import {
  IconFileSettings,
  IconSettings,
  IconSettingsAutomation,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ProfileToggleData } from "../data/profile.data";
import {
  useToggleEditProfile,
  useIsEditProfileToggled,
} from "../artist/store/artist-profile.store";
import { Settings, Settings2Icon } from "lucide-react";

interface IProfileEditToggle {
  id: string;
  isListed: boolean;
  role?: string;
}

const ProfileEditToggle: React.FC<IProfileEditToggle> = ({
  id,
  isListed,
  role,
}) => {
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
  };

  const handleMenuItemClick = (itemId: string) => {
    if (itemId === "edit-profile") {
      toggleEditProfile(id);
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
          className="flex w-[fit] touch-manipulation flex-row items-center rounded-[15px] bg-white/50 p-2 shadow-sm backdrop-blur-md hover:opacity-100 focus:opacity-100 focus-visible:opacity-100 active:opacity-100"
        >
          <Settings2Icon className="motion-preset-expand motion-duration-200 h-4 w-4 text-neutral-300" />
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
                <div className="flex w-fit touch-manipulation flex-col gap-1 rounded-[15px] bg-white/50 p-2 text-nowrap shadow-sm backdrop-blur-md">
                  {ProfileToggleData.map((item, index) => (
                    <button
                      key={item.id}
                      onClick={() => handleMenuItemClick(String(item.id))}
                      className="group flex w-full flex-col items-start"
                    >
                      <p className="font-grotesk text-sm font-medium text-white transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                        {item.name}
                      </p>
                    </button>
                  ))}
                  {isListed ? (
                    <p className="font-grotesk text-sm font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95">
                      Unlist
                    </p>
                  ) : (
                    <p className="font-grotesk text-sm font-medium text-white transition-all duration-200 hover:scale-105 active:scale-95">
                      list
                    </p>
                  )}
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
