"use client";

import UploadEditor from "./upload-editor";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useUploadContext } from "../context/upload-context";
import { ArrowLeft, Settings2Icon } from "lucide-react";

const UploadEditorCanvas = () => {
  const { isEditorOpen, setIsEditorOpen } = useUploadContext();
  const shouldReduceMotion = useReducedMotion();
  const variants = {
    hidden: shouldReduceMotion
      ? { opacity: 0 }
      : { opacity: 0, x: 28, scale: 0.99 },
    visible: shouldReduceMotion
      ? { opacity: 1 }
      : { opacity: 1, x: 0, scale: 1 },
  };
  const transition = shouldReduceMotion
    ? { duration: 0.12, ease: "easeOut" as const }
    : {
        type: "spring" as const,
        stiffness: 280,
        damping: 30,
        mass: 0.8,
      };

  return (
    <section className="relative flex w-full flex-col">
      <div className="flex flex-col">
        <AnimatePresence initial={false}>
          {isEditorOpen && (
            <motion.div
              variants={variants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={transition}
              className="flex h-[100dvh] min-h-screen flex-col overflow-y-auto bg-neutral-100 px-3 pb-4 sm:px-5 md:min-h-0 md:rounded-l-[24px] md:px-7"
            >
              <header className="sticky top-0 z-40 -mx-3 mb-5 flex items-center justify-between border-b border-neutral-200 bg-neutral-100/95 px-3 py-3 backdrop-blur sm:-mx-5 sm:px-5 md:-mx-7 md:px-7">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-700 text-white shadow-sm">
                    <Settings2Icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h1 className="font-helvetica text-base font-bold text-neutral-900 sm:text-lg">
                      Upload editor
                    </h1>
                    <p className="font-grotesk text-[11px] text-neutral-500 sm:text-xs">
                      Details that help your work get discovered
                    </p>
                  </div>
                </div>
                <motion.button
                  className="font-grotesk inline-flex min-h-10 items-center gap-2 rounded-xl border border-neutral-200 bg-white px-3 text-sm font-medium text-neutral-700 shadow-sm transition-colors hover:bg-neutral-50"
                  type="button"
                  aria-label="Close upload editor"
                  onClick={() => setIsEditorOpen(false)}
                >
                  <ArrowLeft className="h-4 w-4 md:hidden" />
                  <span className="hidden md:inline">Close</span>
                  <Settings2Icon className="hidden h-4 w-4 md:block" />
                </motion.button>
              </header>
              <div className="flex-1">
                <UploadEditor />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

export default UploadEditorCanvas;
