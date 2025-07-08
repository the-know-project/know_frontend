"use client";
import Image from "next/image";
import { useStableAuthStatus } from "../../auth/hooks/use-stable-auth-status";
import { IconLocation } from "@tabler/icons-react";
import { BlankProfilePicture } from "@/src/constants/constants";

const Sidebar = () => {
  const { user, role, isLoading } = useStableAuthStatus({
    redirectOnExpiry: true,
    redirectTo: "/login",
  });

  const profilePicture = isLoading
    ? BlankProfilePicture
    : (user?.imageUrl as string);
  return (
    <aside className="w-72 p-4">
      <div className="flex flex-col items-center">
        <div className="flex flex-col items-start text-center">
          <Image
            src={profilePicture}
            alt="avatar"
            width={72}
            height={72}
            className="mb-2 rounded-full"
          />
          {/* Name and Role */}
          <div className="flex flex-col items-start">
            <h2 className="font-bricolage text-lg font-bold capitalize">
              {user?.firstName}
            </h2>
            <p className="font-bricolage text-sm text-neutral-600 capitalize">
              {role?.toLowerCase()}
            </p>
          </div>

          {/* Location */}
          <div className="mt-2 flex gap-2 text-sm text-neutral-700">
            <IconLocation />
            <p className="font-bricolage text-sm font-medium capitalize">
              Nigeria
            </p>
          </div>
          <button className="font-bricolage relative mt-5 inline-flex w-fit items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95">
            Edit profile information
          </button>

          <div className="mt-4 w-full">
            <ul className="font-bricolage text-sm text-neutral-700 capitalize">
              <li className="flex justify-between py-1">
                Post Views <span className="font-semibold">15M</span>
              </li>
              <li className="flex justify-between py-1">
                Followers <span className="font-semibold">1.3K</span>
              </li>
              <li className="flex justify-between py-1">
                Following <span className="font-semibold">382</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
