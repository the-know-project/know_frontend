"use client";

import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "@/src/features/explore/state/explore-content.store";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";

const ArtDetails = () => {
  const { toggledContentId, viewportPosition } = useIsExploreContentToggled();
  const toggleExploreContent = useToggleExploreContent();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <>
      <AnimatePresence>
        <>
          {/* Backdrop */}
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              delay: 0.05,
              ease: "easeInOut",
              duration: 0.3,
            }}
            className="fixed inset-0 z-40"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
              inset: 0,
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.95)",
            }}
            onClick={() => toggleExploreContent(toggledContentId as string)}
          />

          {/* Popup */}
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
            className="absolute z-50 rounded-2xl bg-transparent shadow-2xl"
            style={{
              top: viewportPosition
                ? viewportPosition.scrollY +
                  viewportPosition.viewportHeight * 0.1
                : typeof window !== "undefined"
                  ? window.scrollY + window.innerHeight * 0.1
                  : 0,
              left:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "-3vw"
                  : "10vw",
              width:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "95vw"
                  : "80vw",
              height:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "95vh"
                  : "95vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full w-full flex-col">
              {/* Header */}
              <div className="flex items-center justify-between px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-sm font-bold text-white">A</span>
                  </div>
                  <div>
                    <h1 className="font-bricolage text-lg font-bold text-white">
                      Angels of Thanopeleus
                    </h1>
                    <p className="font-bricolage text-xs text-gray-400 sm:text-sm">
                      Victoria Ingleby • Follow
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleExploreContent(toggledContentId as string)
                  }
                  className="flex h-8 w-8 max-w-fit items-center justify-center rounded-full bg-white p-2"
                >
                  <IconX width={20} height={20} className="text-black" />
                </button>
              </div>

              {/* Content */}
              <div className="custom-scrollbar flex-1 overflow-auto rounded-2xl bg-[#141414]">
                <div className="space-y-6">
                  <div className="p-6">
                    <h2 className="font-bricolage mb-4 text-2xl font-bold text-white">
                      Angels of Thanopeleus
                    </h2>
                    <p className="font-bricolage max-w-prose text-xs leading-relaxed text-neutral-300 sm:text-sm">
                      This painting is special to me because it came from a
                      dream I couldn't shake, a vision of celestial beings
                      standing guard over a forgotten city at the edge of
                      meaning and myth. "Thanopeleus" was the place my
                      unconscious mind led me toward, a space where great hope
                      and transcendence live side by side.
                    </p>
                  </div>

                  {/* Artwork Image */}
                  <div className="mt-8 flex w-full">
                    <div className="relative w-full overflow-hidden">
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-orange-200 via-yellow-100 to-blue-200">
                        <p className="text-lg text-gray-600">Artwork Preview</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      </AnimatePresence>
    </>
  );
};

export default ArtDetails;
