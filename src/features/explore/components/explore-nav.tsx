"use client";

import { MockNotifications } from "@/src/constants/constants";
import { IconBellRinging, IconUser } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useAuthStatus } from "../../auth/hooks";
import ExploreForm from "./explore-form";
import NotificationCard from "../../notifications/components/notification-card";

const ExploreNav = () => {
  const [isNotificationClicked, setIsNotificationClicked] =
    useState<boolean>(false);
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const router = useRouter();
  const { user, role } = useAuthStatus();
  const data = MockNotifications;

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

  useEffect(() => {
    if (data.length > 0) {
      const interval = setInterval(() => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 1000); // Stop shaking after 1 second
      }, 5000); // Shake every 5 seconds

      return () => clearInterval(interval);
    }
  }, [data.length]);

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
              <div className="relative">
                <IconBellRinging
                  onClick={handleNotificationClicked}
                  className={`h-[32px] w-[32px] cursor-pointer text-neutral-600 ${
                    data.length > 0 && shouldShake
                      ? "motion-preset-shake motion-duration-700"
                      : ""
                  }`}
                />
                {data.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 p-2 text-[10px] font-medium text-white">
                    {data.length > 99 ? "99+" : data.length}
                  </span>
                )}
              </div>
              <div className="absolute top-[50px] right-[250px] z-50 w-full lg:right-[270px]">
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
                      <NotificationCard data={data} />
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
