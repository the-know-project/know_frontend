"use client";

import { IconCaretLeft, IconCaretRight } from "@tabler/icons-react";
import UploadEditor from "./upload-editor";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

const UploadEditorCanvas = () => {
  const [isEditorOpen, setIsEditorOpen] = useState<boolean>(true);
  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="flex w-full flex-col">
      <div
        className={`hidden flex-col md:flex ${isEditorOpen ? "flex" : "hidden"}`}
      >
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
              className="flex min-h-screen flex-col gap-5 bg-neutral-300 px-2 py-10"
            >
              <motion.button
                className="font-bebas text-whit relative hidden w-fit items-center gap-1 rounded-full bg-neutral-600 p-2 text-sm font-medium capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px] md:inline-flex"
                type="button"
                onClick={() => setIsEditorOpen(false)}
              >
                <IconCaretRight width={20} height={20} color="white" />
              </motion.button>
              <UploadEditor />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {!isEditorOpen && (
        <div className="hidden items-end justify-end px-2 py-10 md:flex">
          <motion.button
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              delay: 0.35,
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="font-bebas text-whit relative hidden w-fit items-center gap-1 rounded-full bg-neutral-600 p-2 text-sm font-medium capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px] md:inline-flex"
            type="button"
            onClick={() => setIsEditorOpen(true)}
          >
            <IconCaretLeft width={20} height={20} color="white" />
          </motion.button>
        </div>
      )}

      <div className="flex w-full flex-col gap-5 bg-neutral-300 px-2 py-10 md:hidden">
        <UploadEditor />
      </div>
    </section>
  );
};

export default UploadEditorCanvas;
