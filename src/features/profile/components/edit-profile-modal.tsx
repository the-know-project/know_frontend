"use client";

import { AnimatePresence, motion } from "framer-motion";
import { IconX } from "@tabler/icons-react";
import React, { useEffect, useState, useCallback } from "react";
import {
  useIsEditProfileToggled,
  useToggleEditProfile,
} from "@/src/features/profile/artist/store/artist-profile.store";
import EditProfileForm from "./edit-profile-form";
import ReactDOM from "react-dom";

interface IEditProfileModal {
  userId: string;
}

const EditProfileModal: React.FC<IEditProfileModal> = ({ userId }) => {
  const [mounted, setMounted] = useState(false);
  const isOpen = useIsEditProfileToggled(userId);
  const toggleEditProfile = useToggleEditProfile();

  useEffect(() => {
    setMounted(true);
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    toggleEditProfile(userId, false);
  }, [toggleEditProfile, userId]);

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.05,
              ease: "easeInOut",
              duration: 0.09,
            }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 flex w-full items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-[90vh] w-full max-w-7xl overflow-hidden rounded-2xl bg-white shadow-2xl">
              {/* Close Button */}
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 z-10 rounded-full bg-gray-100 p-2 transition-colors hover:bg-gray-200"
              >
                <IconX size={24} />
              </button>

              {/* Content */}
              <div className="h-full overflow-y-auto">
                <EditProfileForm userId={userId} onClose={handleClose} />
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default React.memo(EditProfileModal);
