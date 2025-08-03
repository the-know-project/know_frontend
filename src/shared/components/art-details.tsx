"use client";

import { empty } from "@/src/assets";
import { BlankProfilePicture } from "@/src/constants/constants";
import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "@/src/features/explore/state/explore-content.store";
import { showLog } from "@/src/utils/logger";
import { IconTag, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect } from "react";

const ArtDetails = () => {
  const {
    toggledContentId,
    viewportPosition,
    exploreContent,
    isExploreContentToggled,
  } = useIsExploreContentToggled();
  const toggleExploreContent = useToggleExploreContent();

  /**
   * @Note: This effect prevents body scrolling when the modal is open.
   */
  // useEffect(() => {
  //   if (isExploreContentToggled) {
  //     document.body.style.overflow = "hidden";
  //   } else {
  //     document.body.style.overflow = "unset";
  //   }

  //   return () => {
  //     document.body.style.overflow = "unset";
  //   };
  // }, [isExploreContentToggled]);

  showLog({
    context: "Art-Details",
    data: exploreContent,
  });

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const popupVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1 },
    exit: { opacity: 0, y: -20, scale: 0.95 },
  };

  return (
    <AnimatePresence mode="wait">
      {isExploreContentToggled && toggledContentId && (
        <div key={`modal-${toggledContentId}`}>
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.3,
              ease: "easeInOut",
            }}
            className="fixed inset-0 z-40"
            style={{
              top: 0,
              left: 0,
              width: "100vw",
              height: Math.max(
                typeof window !== "undefined"
                  ? document.documentElement.scrollHeight
                  : 0,
                typeof window !== "undefined" ? window.innerHeight : 0,
              ),
              position: "fixed",
              backdropFilter: "blur(5px)",
              backgroundColor: "rgba(0, 0, 0, 0.95)",
            }}
            onClick={() =>
              toggleExploreContent(toggledContentId as string, null)
            }
          />

          {/* Popup */}
          <motion.div
            variants={popupVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            transition={{
              duration: 0.3,
              ease: "easeInOut",
              delay: 0.05,
            }}
            className="fixed z-50 rounded-2xl bg-transparent shadow-2xl"
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
                  ? "83vh"
                  : "95vh",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl">
              {/* Header */}
              <div className="flex items-center justify-between bg-transparent px-4 py-4">
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
              <div className="custom-scrollbar flex-1 overflow-auto bg-[#141414]">
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

                    {/*Tags*/}
                    <div className="mt-2 flex items-center gap-2">
                      {exploreContent?.tags?.map((tag, index) => (
                        <span
                          key={index}
                          className="font-bebas motion-duration-500 motion-preset-expand flex items-center gap-1 rounded-full bg-neutral-600/50 px-2 py-1 text-xs font-medium tracking-wider text-white lowercase shadow-sm"
                          style={{
                            animationDelay: `${index * 150}ms`,
                          }}
                        >
                          <IconTag width={15} height={15} /> {tag}
                        </span>
                      ))}
                    </div>
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

              {/* Categories */}
              <div className="lg-mt-[50px] mt-0 border-t border-neutral-700 bg-[#141414] px-4 py-3">
                <div className="flex flex-wrap">
                  {exploreContent?.categories?.map((category, index) => (
                    <span
                      key={index}
                      className="font-bebas motion-duration-500 motion-preset-expand mt-2 mr-2 rounded-full bg-neutral-600/50 px-2 py-1 text-xs font-medium tracking-wider text-white lowercase"
                      style={{
                        animationDelay: `${index * 150}ms`,
                      }}
                    >
                      {category}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ArtDetails;
