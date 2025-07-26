"use client";

import { IconCaretLeft, IconCaretRight } from "@tabler/icons-react";
import UploadEditor from "./upload-editor";
import { AnimatePresence, motion } from "framer-motion";
import { useUploadContext } from "../context/upload-context";

const UploadEditorCanvas = () => {
  const { isEditorOpen, setIsEditorOpen } = useUploadContext();
  const variants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section className="flex w-full flex-col">
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
                className="font-bebas text-whit relative flex w-fit items-center gap-1 rounded-full bg-neutral-600 p-2 text-sm font-medium capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
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
        <div className="flex w-full items-end justify-end py-[55px]">
          <motion.button
            variants={variants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              delay: 0,
              ease: "easeIn",
              duration: 0.2,
            }}
            className="font-bebas text-whit relative flex w-fit items-center gap-1 rounded-full bg-neutral-600 p-2 text-sm font-medium capitalize outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
            type="button"
            onClick={() => setIsEditorOpen(true)}
          >
            <IconCaretLeft width={20} height={20} color="white" />
          </motion.button>
        </div>
      )}
    </section>
  );
};

export default UploadEditorCanvas;
