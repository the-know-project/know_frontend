"use client";

import { empty } from "@/src/assets";
import { BlankProfilePicture } from "@/src/constants/constants";
import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "@/src/features/explore/state/explore-content.store";
import { showLog } from "@/src/utils/logger";
import { IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";

const ArtDetails = () => {
  const { toggledContentId, viewportPosition, exploreContent } =
    useIsExploreContentToggled();
  const toggleExploreContent = useToggleExploreContent();

  showLog({
    context: "Art-Details",
    data: exploreContent,
  });

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const variant2 = {
    hidden: { y: -20 },
    visible: { y: 0 },
  };

  return (
    <>
      <AnimatePresence>
        <>
          {/* Backdrop */}
          <motion.div
            variants={variant2}
            initial="hidden"
            animate="visible"
            exit="hidden"
            transition={{
              delay: 0.07,
              ease: "easeInOut",
              duration: 1.5,
            }}
            className="fixed inset-0 z-40 min-h-screen"
            style={{
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              position: "fixed",
              inset: 0,
              transitionBehavior: "normal",
              transitionDuration: "300s",
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.95)",
            }}
            onClick={() =>
              toggleExploreContent(toggledContentId as string, null)
            }
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
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 p-1">
                    <Image
                      src={
                        exploreContent?.creatorProfileUrl || BlankProfilePicture
                      }
                      alt="creator_profile"
                      width={32}
                      height={32}
                      className="rounded-full object-contain object-center select-none"
                    />
                  </div>
                  <div>
                    <h1 className="font-bricolage text-lg font-bold text-white capitalize">
                      {exploreContent?.artName}
                    </h1>
                    <div className="font-bricolage flex gap-1 text-xs text-gray-400 capitalize sm:text-sm">
                      <p>{exploreContent?.creatorName}• </p>
                      <button className="hover:text-blue-300"> Follow</button>
                    </div>
                  </div>
                </div>
                <button
                  onClick={() =>
                    toggleExploreContent(toggledContentId as string, null)
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
                    <h2 className="font-bricolage mb-4 text-2xl font-bold text-white capitalize">
                      {exploreContent?.artName}
                    </h2>
                    <p className="font-bricolage max-w-prose text-xs leading-relaxed text-neutral-300 sm:text-sm">
                      {exploreContent?.description === null
                        ? "Brought to you by Know, The ultimate partner for creatives."
                        : exploreContent?.description}
                    </p>
                  </div>

                  {/* Artwork Image */}
                  <div className="mt-8 flex w-full">
                    <div className="relative w-full overflow-hidden">
                      <div className="flex aspect-video items-center justify-center bg-gradient-to-br from-orange-200 via-yellow-100 to-blue-200">
                        <Image
                          src={exploreContent?.artWorkUrl || empty}
                          alt="art_work"
                          quality={100}
                          priority
                          width={700}
                          height={500}
                          className="w-full object-contain object-center"
                        />
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
