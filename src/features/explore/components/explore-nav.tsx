"use client";

import { MockNotifications } from "@/src/constants/constants";
import { IconBellRinging, IconUser } from "@tabler/icons-react";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSafeAuthStatus } from "../../auth/hooks";
import NotificationCard from "../../notifications/components/notification-card";
import { useFetchUserNotifications } from "../../notifications/hooks/use-fetch-user-notifications";
import { INotificationData } from "../../notifications/types/notification.types";
import ExploreForm from "./explore-form";
import Link from "next/link";
import ProfileModal from "../../profile/components/profile-modal";

const ExploreNav = () => {
  const [isNotificationClicked, setIsNotificationClicked] =
    useState<boolean>(false);
  const [isProfileClicked, setIsProfileClicked] = useState<boolean>(false);
  const [shouldShake, setShouldShake] = useState<boolean>(false);
  const [notifications, setNotifications] =
    useState<INotificationData[]>(MockNotifications);
  const [isClient, setIsClient] = useState(false);
  const { user, role, isLoading: authLoading } = useSafeAuthStatus();
  const router = useRouter();

  const { data: notificationData } = useFetchUserNotifications();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient && !authLoading) {
      if (user && notificationData?.data) {
        setNotifications(notificationData.data);
      } else {
        setNotifications(MockNotifications);
      }
    }
  }, [isClient, user, notificationData, authLoading]);

  const variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const handleCtaNavigate = () => {
    if (role.toLowerCase() === "artist") {
      router.push("/upload");
    } else if (role.toLowerCase() === "buyer") {
      router.push("/cart");
    }
  };

  const handleNotificationClicked = () => {
    setIsNotificationClicked((prev) => !prev);
    setIsProfileClicked(false);
  };

  const handleProfileClicked = () => {
    setIsProfileClicked((prev) => !prev);
    setIsNotificationClicked(false);
  };

  useEffect(() => {
    if (notifications.length > 0) {
      const interval = setInterval(() => {
        setShouldShake(true);
        setTimeout(() => setShouldShake(false), 1000);
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [notifications.length]);

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
        <Link href={"/"} className="flex flex-col items-start gap-1">
          <Image
            src="/Know-Logo.png"
            alt="logo"
            width={50}
            height={50}
            className="object-contain object-center"
          />
        </Link>

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
          {!authLoading && user && role.toLowerCase() === "artist" ? (
            <button
              className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
              onClick={handleCtaNavigate}
            >
              <p className="block">Share your work</p>
            </button>
          ) : !authLoading && user && role.toLowerCase() === "buyer" ? (
            <button
              className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
              onClick={handleCtaNavigate}
            >
              <p className="block">View cart</p>
            </button>
          ) : (
            <button
              className="font-bricolage relative inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95 sm:text-[16px]"
              onClick={handleCtaNavigate}
            >
              <p className="block">View cart</p>
            </button>
          )}

          <div className="flex items-center gap-2 bg-transparent px-2">
            <div className="relative flex w-full flex-col">
              <button className="relative" onClick={handleNotificationClicked}>
                <IconBellRinging
                  className={`h-[32px] w-[32px] cursor-pointer text-neutral-600 ${
                    notifications.length > 0 && shouldShake
                      ? "motion-preset-shake motion-duration-700"
                      : ""
                  }`}
                />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-3 w-3 items-center justify-center rounded-full bg-red-500 p-2 text-[10px] font-medium text-white">
                    {notifications.length > 99 ? "99+" : notifications.length}
                  </span>
                )}
              </button>
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
                      {notifications.length > 0 && (
                        <NotificationCard data={notifications} />
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
            {!authLoading && user?.imageUrl ? (
              <div className="flex w-full flex-col">
                <button onClick={handleProfileClicked}>
                  <Image
                    alt="user profile"
                    src={user?.imageUrl}
                    width={32}
                    height={32}
                    className="rounded-full object-contain object-center"
                  />
                </button>

                <div className="absolute top-[100px] right-[50px] z-50 w-fit sm:top-[80px]">
                  <AnimatePresence>
                    {isProfileClicked && (
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
                          firstName={user.firstName}
                          emailAddress={user.email}
                          imageUrl={user.imageUrl}
                          role={role}
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
