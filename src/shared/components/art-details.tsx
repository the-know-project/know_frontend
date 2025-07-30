"use client";

import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "@/src/features/explore/state/explore-content.store";
import { AnimatePresence, motion } from "framer-motion";

const ArtDetails = () => {
  const { isExploreContentToggled, toggledContentId, viewportPosition } =
    useIsExploreContentToggled();
  const toggleExploreContent = useToggleExploreContent();
  console.log(
    `is content toggled: ${isExploreContentToggled} : ${toggledContentId}`,
  );

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
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 backdrop-blur-md"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
              inset: 0,
              backgroundColor: "rgba(0, 0, 0, 0.8)",
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
            className="absolute z-50 rounded-2xl border border-gray-700 bg-gray-900 shadow-2xl"
            style={{
              top: viewportPosition
                ? viewportPosition.scrollY +
                  viewportPosition.viewportHeight * 0.1
                : typeof window !== "undefined"
                  ? window.scrollY + window.innerHeight * 0.1
                  : 0,
              left:
                typeof window !== "undefined" && window.innerWidth < 768
                  ? "2.5vw"
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
              <div className="flex items-center justify-between border-b border-gray-700 px-6 py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600">
                    <span className="text-sm font-bold text-white">A</span>
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">
                      Angels of Thanopeleus
                    </h1>
                    <p className="text-sm text-gray-400">
                      Victoria Ingleby • Follow
                    </p>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleExploreContent(toggledContentId as string)
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-800 text-gray-400 transition-colors hover:bg-gray-700 hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-auto p-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="mb-4 text-2xl font-bold text-white">
                      Angels of Thanopeleus
                    </h2>
                    <p className="leading-relaxed text-gray-300">
                      This painting is special to me because it came from a
                      dream I couldn't shake, a vision of celestial beings
                      standing guard over a forgotten city at the edge of
                      meaning and myth. "Thanopeleus" was the place my
                      unconscious mind led me toward, a space where great hope
                      and transcendence live side by side.
                    </p>
                  </div>

                  <div>
                    <p className="leading-relaxed text-gray-300">
                      When I work, I ask myself these questions: can a painting
                      be ancient and unnerving, Guardians of things we've lost
                      but still carry. Each stroke felt like an inquiry into the
                      mysteries of existence, the gold tones illuminated
                      whispers of transcendence that refuse to stay silent. This
                      work is about presence in absence. About how feeling can
                      exist in our minds.
                    </p>
                  </div>

                  <div>
                    <p className="leading-relaxed text-gray-300">
                      It's an offering. A meaning. A prayer in paint.
                    </p>
                  </div>

                  {/* Artwork Image */}
                  <div className="mt-8">
                    <div className="relative overflow-hidden rounded-lg bg-gray-800">
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
