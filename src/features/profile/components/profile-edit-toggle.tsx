"use client";

import {
  IconArrowRightCircleFilled,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

interface IProfileEditToggle {
  id: string;
  role?: string;
}

const ProfileEditToggle: React.FC<IProfileEditToggle> = ({ id, role }) => {
  const [editToggled, setEditToggled] = useState(false);
  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const toggleEdit = () => {
    setEditToggled((prev) => !prev);
  };

  return (
    <section className="flex w-full flex-col">
      <div className="relative flex flex-col">
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

        <div className="aboslute top-1 flex w-full px-4">
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
                <p className="text-black">Edit drop down goes here</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};

export default ProfileEditToggle;
