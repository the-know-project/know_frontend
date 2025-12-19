"use client";

import {
  ProfileModalItemsArtist,
  ProfileModalItemsBuyer,
} from "@/src/constants/constants";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLogout } from "../../auth/hooks";
import Spinner from "@/src/shared/components/spinner";
import {
  useIsEditProfileToggled,
  useToggleEditProfile,
} from "@/src/features/profile/artist/store/artist-profile.store";
import EditProfileModal from "./edit-profile-modal";
import React, { useEffect, useState } from "react";
import { showLog } from "@/src/utils/logger";

interface ProfileModalProps {
  firstName: string;
  imageUrl: string;
  emailAddress: string;
  role: string;
  userId: string;
  onClose: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({
  firstName,
  imageUrl,
  emailAddress,
  role,
  userId,
  onClose,
}) => {
  const router = useRouter();
  const toggleEditProfile = useToggleEditProfile();
  const isOpen = useIsEditProfileToggled(userId);
  const { mutate: handleLogout, isPending: isLoggingOut } = useLogout();

  useEffect(() => {
    return () => {
      toggleEditProfile(userId, false);
    };
  }, [toggleEditProfile, userId]);

  const userNavigationData =
    role.toLowerCase() === "buyer"
      ? ProfileModalItemsBuyer
      : ProfileModalItemsArtist;

  const handleNavigation = (ctx: string) => {
    const action = ctx.toLowerCase();

    if (action === "my profile") {
      if (role.toLowerCase() === "buyer") {
        router.push("/buyer-profile");
      } else if (role.toLowerCase() === "artist") {
        router.push("/artist-profile");
      }
    } else if (action === "sign out") {
      handleLogout();
    } else if (action === "edit profile") {
      if (userId) {
        toggleEditProfile(userId);
      }
    }
  };

  return (
    <section className="scrollbar-hide relative flex min-h-[300px] min-w-[300px] scroll-m-2 flex-col overflow-auto scroll-smooth rounded-[15px] border border-white/20 bg-white px-2 py-4 opacity-95 shadow-[0_8px_32px_0_rgba(31,38,135,0.37),inset_0_1px_0_0_rgba(255,255,255,0.18)] backdrop-blur-2xl">
      <div className="flex w-full flex-col items-center justify-center gap-5">
        <Image
          src={imageUrl}
          alt={firstName}
          width={72}
          height={72}
          quality={100}
          className="rounded-full object-cover"
        />
        <div className="flex flex-col items-center justify-center text-center">
          <h3 className="font-bricolage text-[20px] font-bold text-neutral-900 capitalize">
            {firstName}
          </h3>
          <p className="font-bricolage text-[12px] text-neutral-600">
            {emailAddress}
          </p>
          <button className="font-bebas relative mt-[10px] inline-flex w-fit items-center gap-[8px] self-center rounded-2xl bg-[#1E3A8A] pt-[8px] pr-[8px] pb-[8px] pl-[8px] text-[12px] font-light tracking-wider text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95">
            Upgrade to premium
          </button>
        </div>
      </div>
      <hr className="mt-[30px] border-t border-neutral-200" />
      <div className="mt-[20px] flex w-full flex-col items-start gap-[10px] px-5">
        {userNavigationData.map((item, index) => {
          const isSignOutButton = item.title.toLowerCase() === "sign out";
          return (
            <button
              key={item.id}
              className="motion-preset-slide-down motion-duration-500 motion-delay-100 group flex w-full flex-col items-start"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
              onClick={() => handleNavigation(item.title)}
              disabled={isSignOutButton && isLoggingOut}
            >
              {isSignOutButton && isLoggingOut && <Spinner />}
              <p className="font-bricolage text-sm text-neutral-700 transition-all duration-200 group-hover:scale-105 group-active:scale-95">
                {item.title}
              </p>
            </button>
          );
        })}
      </div>
      <div className="absolute z-50">
        {isOpen && <EditProfileModal userId={userId} />}
      </div>
    </section>
  );
};

export default React.memo(ProfileModal);
