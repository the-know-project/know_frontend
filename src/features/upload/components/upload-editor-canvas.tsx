"use client";

import {
  IconArtboard,
  IconCaretLeft,
  IconCaretRight,
} from "@tabler/icons-react";
import UploadEditor from "./upload-editor";
import { AnimatePresence, motion } from "framer-motion";
import { useUploadContext } from "../context/upload-context";
import { Settings2Icon } from "lucide-react";

const UploadEditorCanvas = () => {
  const { isEditorOpen, setIsEditorOpen } = useUploadContext();
  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="relative flex w-full flex-col">
      <div className={`flex flex-col ${isEditorOpen ? "flex" : "hidden"}`}>
        <AnimatePresence>
          {isEditorOpen && (
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: 0.05,
                ease: "easeInOut",
                duration: 0.09,
              }}
              className="flex min-h-screen flex-col gap-5 rounded-tl-[15px] rounded-bl-[15px] bg-neutral-300 px-4 py-10 lg:px-8"
            >
              <motion.button
                className="font-bebas relative z-10 w-fit rounded-lg bg-neutral-800 px-2 py-1 text-sm font-normal tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-3 lg:text-[16px]"
                type="button"
                onClick={() => setIsEditorOpen(false)}
              >
                <Settings2Icon className="motion-preset-expand motion-duration-200 h-4 w-4" />
              </motion.button>
              <UploadEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default UploadEditorCanvas;
