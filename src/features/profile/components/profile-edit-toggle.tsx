"use client";

import {
  IconArrowRightCircleFilled,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { ProfileToggleData } from "../data/profile.data";
import {
  useToggleEditProfile,
  useIsEditProfileToggled,
} from "../artist/store/artist-profile.store";

interface IProfileEditToggle {
  id: string;
  role?: string;
}

const ProfileEditToggle: React.FC<IProfileEditToggle> = ({ id, role }) => {
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
  }, [editToggled]);

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
            className={`${editToggled ? "rotate-90 transition-transform duration-300" : "transition-transform duration-300"}`}
          />
        </button>

        <div className="aboslute flex w-full px-4">
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
                <div className="flex w-[138px] touch-manipulation flex-col gap-[8px] rounded-[9px] bg-[#F4F4F4] px-4 pt-[12px] pb-[12px] opacity-75 sm:gap-[16px]">
                  {ProfileToggleData.map((item, index) => (
                    <button
                      key={item.id}
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
