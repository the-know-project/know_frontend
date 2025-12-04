"use client";

import { empty } from "@/src/assets";
import { BlankProfilePicture } from "@/src/constants/constants";
import ExploreArtistInfo from "@/src/features/explore/components/explore-artist-info";
import ExploreCommentSection from "@/src/features/explore/components/explore-comment-section";
import {
  useIsExploreContentToggled,
  useToggleExploreContent,
} from "@/src/features/explore/state/explore-content.store";
import { useFollowUser } from "@/src/features/metrics/hooks/use-follow-user";
import { showLog } from "@/src/utils/logger";
import { IconTag, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useUnfollowUser } from "@/src/features/metrics/hooks/use-unfollow-user";
import { useFollowActions } from "@/src/features/metrics/state/store/metrics.store";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";

const ArtDetails = () => {
  const [mounted, setMounted] = useState(false);
  const followerId = useTokenStore(selectUserId);
  const {
    toggledContentId,
    viewportPosition,
    exploreContent,
    isExploreContentToggled,
  } = useIsExploreContentToggled();
  const toggleExploreContent = useToggleExploreContent();
  const { mutateAsync: followUser, isPending } = useFollowUser();
  const { mutateAsync: unFollowUser, isPending: isUnfollowing } =
    useUnfollowUser();
  const { useIsUserFollowing } = useFollowActions();

  const isFollowing = useIsUserFollowing(
    followerId || "",
    exploreContent?.userId || "",
  );

  const handleFollowUser = async (artistId: string) => {
    if (isFollowing) {
      await unFollowUser({
        followingId: artistId,
      });
    } else {
      await followUser({
        followingId: artistId,
      });
    }
  };

  useEffect(() => {
    setMounted(true);
    if (isExploreContentToggled) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isExploreContentToggled]);

  showLog({
    context: "Art-Details",
    data: exploreContent,
  });

  showLog({
    context: "From Art Details: Validating follow",
    data: isFollowing,
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

  if (!mounted) return null;

  return ReactDOM.createPortal(
    <div className="relative flex w-full flex-col items-center justify-center">
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
                top: "0",
                left: window.innerWidth < 768 ? "2%" : "10%",
                width:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "95vw"
                    : "80vw",
                height:
                  typeof window !== "undefined" && window.innerWidth < 768
                    ? "90vh"
                    : "95vh",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex h-full w-full flex-col overflow-hidden rounded-2xl">
                {/* Header */}
                <div className="flex items-center justify-between bg-transparent px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 p-1 backdrop-blur-lg">
                      <Image
                        src={
                          exploreContent?.creatorProfileUrl ||
                          BlankProfilePicture
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
                      <div className="font-bricolage flex gap-1 text-xs tracking-wide text-neutral-300 capitalize sm:text-sm">
                        <p>{exploreContent?.creatorName} • </p>

                        <button
                          onClick={() =>
                            handleFollowUser(exploreContent?.userId || "")
                          }
                          className="font-bricolage text-xs font-light tracking-wide text-neutral-400 hover:text-blue-300"
                        >
                          {isFollowing === true ? "Unfollow" : "Follow"}
                        </button>
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
                            src={exploreContent?.highResUrl || empty}
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

                    <div className="grid w-full grid-cols-1 gap-8 bg-[#FAFAFA] lg:grid-cols-3">
                      {/* Left side for comments */}
                      <div className="lg:col-span-2">
                        <ExploreCommentSection />
                      </div>
                      {/* Right side for artist info */}
                      <div>
                        {exploreContent?.userId && (
                          <ExploreArtistInfo
                            artistId={exploreContent.userId}
                            artwork={exploreContent}
                          />
                        )}
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
                        className="font-bebas motion-duration-500 motion-preset-expand mt-2 mr-2 rounded-md bg-neutral-600/50 px-2 py-1 text-xs font-medium tracking-wider text-white lowercase"
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
    </div>,
    document.body,
  );
};
export default ArtDetails;
