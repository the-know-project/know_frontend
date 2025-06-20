"use client";

import { IconBell, IconBellRinging, IconUser } from "@tabler/icons-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuthStatus } from "../../auth/hooks";
import ExploreForm from "./explore-form";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import NotificationCard from "@/src/shared/components/notification-card";

const ExploreNav = () => {
  const [isNotificationClicked, setIsNotificationClicked] =
    useState<boolean>(false);
  const router = useRouter();
  const { user, role } = useAuthStatus();

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleShareWork = () => {
    router.push("/upload");
  };

  const handleNotificationClicked = () => {
    setIsNotificationClicked((prev) => !prev);
  };

  return (
    <nav className="motion-preset-expand motion-duration-700 relative z-50 flex w-full flex-col gap-1 py-1">
      <div className="flex w-full px-4 sm:hidden">
        <ExploreForm
          onSearch={(query) => {
            console.log(`Searching for ${query}`);
          }}
          placeholder="Explore"
          debounceMs={300}
        />
      </div>
      <div className="flex items-center justify-between px-4 sm:px-6">
        <div className="flex flex-col items-start gap-1">
          <Image
            src="/Know-Logo.png"
            alt="logo"
            width={50}
            height={50}
            className="object-contain object-center"
          />
        </div>

        <div className="hidden w-full max-w-[300px] sm:flex">
          <ExploreForm
            onSearch={(query) => {
              console.log(`Searching for ${query}`);
            }}
            placeholder="Explore"
            debounceMs={300}
          />
        </div>

        <div className="flex items-center gap-5">
          {user && role.toLowerCase() === "artist" && (
            <button
              className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
              onClick={handleShareWork}
            >
              <p className="block">Share your work</p>
            </button>
          )}

          <div className="flex items-center gap-2 bg-transparent px-2">
            <div className="relative flex w-full flex-col">
              <IconBellRinging
                onClick={handleNotificationClicked}
                className="motion-preset-shake motion-duration-700 h-[32px] w-[32px] text-neutral-600"
              />
              <div className="absolute top-[40px] right-[250px] z-50 w-full lg:right-[270px]">
                <AnimatePresence>
                  {isNotificationClicked && (
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
                    >
                      <NotificationCard />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {user?.imageUrl ? (
              <Image
                alt="user profile"
                src={user?.imageUrl}
                width={32}
                height={32}
                className="rounded-full object-contain object-center"
              />
            ) : (
              <IconUser color="black" className="h-[32px] w-[32px]" />
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ExploreNav;
