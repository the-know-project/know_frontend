"use client";

import { MockNotifications } from "@/src/constants/constants";
import { type ReactElement } from "react";
import { IconBellRinging, IconSearch, IconUser } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import NotificationCard from "../../notifications/components/notification-card";
import { useFetchUserNotifications } from "../../notifications/hooks/use-fetch-user-notifications";
import { INotificationData } from "../../notifications/types/notification.types";
import ProfileModal from "../../profile/components/profile-modal";
import ExploreForm from "./explore-form";
import {
  useCanFetchData,
  useAuthReady,
} from "../../auth/hooks/use-optimized-auth";
import { useFetchNotifications } from "../../notifications/state/store/notifications.store";

interface IExploreNavOptions {
  toggleShareButton?: boolean;
}

const ExploreNav: React.FC<IExploreNavOptions> = ({
  toggleShareButton = true,
}): ReactElement => {
  const [isNotificationClicked, setIsNotificationClicked] =
    useState<boolean>(false);
  const [isProfileClicked, setIsProfileClicked] = useState<boolean>(false);
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [isClient, setIsClient] = useState(false);

  const notificationRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const canFetchData = useCanFetchData();
  const { user, role, isReady } = useAuthReady();
  const router = useRouter();
  const [isSearchToggled, setIsSearchToggled] = useState<boolean>(false);

  const { data: notificationData } = useFetchUserNotifications();
  const notifications = useFetchNotifications(user?.id || "");

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !user) {
      setIsNotificationClicked(false);
      setIsProfileClicked(false);
      setShouldShake(false);
    }
  }, [isClient, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target as Node)
      ) {
        setIsNotificationClicked(false);
      }

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target as Node)
      ) {
        // setIsProfileClicked(false);
      }
    };

    if (isNotificationClicked || isProfileClicked) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isNotificationClicked, isProfileClicked]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const searchVariants = {
    hidden: { opacity: 0, y: -20, height: 0 },
    visible: { opacity: 1, y: 0, height: "auto" },
  };

  const handleCtaNavigate = () => {
    if (!role || !user) return;

    if (role.toLowerCase() === "artist") {
      router.push("/upload");
    } else if (role.toLowerCase() === "buyer") {
      router.push("/cart");
    }
  };

  const handleNotificationClicked = () => {
    if (!user || !isReady) return;

    setIsNotificationClicked((prev) => !prev);
    setIsProfileClicked(false);
  };

  const handleProfileClicked = () => {
    if (!user || !isReady) return;

    setIsProfileClicked((prev) => !prev);
    setIsNotificationClicked(false);
  };

  const handleCloseProfileModal = () => {
    setIsProfileClicked(false);
  };

  const handleSearchToggled = () => {
    setIsSearchToggled((prev) => !prev);
  };

  useEffect(() => {
    if (notifications.length > 0 && user && isReady) {
      const interval = setInterval(() => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 1000);
      }, 5000);

      return () => clearInterval(interval);
    } else {
      setShouldShake(false);
    }
  }, [notifications.length, user, isReady]);

  const isAuthenticated = canFetchData && isReady && user;

  return (
    <nav className="motion-preset-expand motion-duration-700 relative z-50 flex w-full flex-col gap-1 py-1">
      <div className="flex w-full items-center justify-center sm:hidden">
        <AnimatePresence>
          {isSearchToggled && (
            <motion.div
              variants={searchVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              transition={{
                delay: 0.05,
                ease: "easeInOut",
                duration: 0.3,
              }}
            >
              <ExploreForm
                onSearch={(query) => {
                  console.log(`Searching for ${query}`);
                }}
                placeholder="Explore"
                debounceMs={300}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between px-4 sm:px-6">
        <Link href={"/explore"} className="flex flex-col items-start gap-1">
          <Image
            src="/Know-Logo.png"
            alt="logo"
            width={70}
            height={70}
            className="object-cover object-center"
          />
        </Link>

        <div className="hidden w-full sm:flex sm:max-w-[300px] lg:max-w-[500px]">
          <ExploreForm
            onSearch={(query) => {
              console.log(`Searching for ${query}`);
            }}
            placeholder="Explore"
            debounceMs={300}
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-5">
          {isAuthenticated &&
          role?.toLowerCase() === "artist" &&
          toggleShareButton ? (
            <button
              className="font-bebas relative z-10 rounded-lg bg-[#1E3A8A] px-2 py-1 text-sm font-normal tracking-wider text-white shadow-sm transition-all duration-300 hover:scale-105 active:scale-95 sm:px-4 sm:py-2 lg:text-[16px]"
              onClick={handleCtaNavigate}
            >
              <p className="block">Share works</p>
            </button>
          ) : isAuthenticated && role?.toLowerCase() === "buyer" ? (
            <button
              className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-transparent pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:bg-[#1E3A8A] sm:text-[16px]"
              onClick={handleCtaNavigate}
            >
              <p className="block">View cart</p>
            </button>
          ) : null}

          <div className="flex items-center gap-2 bg-transparent px-2">
            <button className="flex sm:hidden" onClick={handleSearchToggled}>
              <IconSearch width={32} height={32} className="text-neutral-600" />
            </button>

            <div
              className="relative flex w-full flex-col"
              ref={notificationRef}
            >
              <button
                className="relative"
                onClick={handleNotificationClicked}
                disabled={!isAuthenticated}
              >
                <IconBellRinging
                  className={`h-[32px] w-[32px] cursor-pointer text-neutral-600 ${
                    notifications.length > 0 && shouldShake && isAuthenticated
                      ? "motion-preset-shake motion-duration-700"
                      : ""
                  } ${!isAuthenticated ? "cursor-not-allowed opacity-50" : ""}`}
                />
                {notifications.length > 0 && isAuthenticated && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 p-2 text-[10px] font-medium text-white">
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </span>
                )}
              </button>

              <div className="absolute top-[50px] right-[270px] z-50 w-full lg:right-[270px]">
                <AnimatePresence>
                  {isNotificationClicked &&
                    isAuthenticated &&
                    notifications.length > 0 && (
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
                        <NotificationCard data={notifications} />
                      </motion.div>
                    )}

                  {isNotificationClicked &&
                    isAuthenticated &&
                    notifications.length < 1 && (
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
                        <NotificationCard data={notifications} />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            </div>

            {canFetchData && isReady && user?.imageUrl ? (
              <div className="flex w-full flex-col" ref={profileRef}>
                <button
                  onClick={handleProfileClicked}
                  className="-mt-1"
                  disabled={!isAuthenticated}
                >
                  <Image
                    alt="user profile"
                    src={user?.imageUrl || ""}
                    width={30}
                    height={30}
                    className="rounded-full object-contain object-center"
                  />
                </button>

                <div className="absolute top-[100px] right-[50px] z-50 w-fit sm:top-[80px]">
                  <AnimatePresence>
                    {isProfileClicked && isAuthenticated && (
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
                        <ProfileModal
                          userId={user?.id || ""}
                          firstName={user?.firstName || ""}
                          emailAddress={user?.email || ""}
                          imageUrl={user?.imageUrl || ""}
                          role={role || ""}
                          onClose={handleCloseProfileModal}
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
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
