"use client";
import Image from "next/image";
import { IconLocation } from "@tabler/icons-react";
import { BlankProfilePicture } from "@/src/constants/constants";
import { useAuthReady } from "../../auth/hooks/use-optimized-auth";
import { useMemo } from "react";
import { useToggleEditProfile } from "../artist/store/artist-profile.store";
import EditProfileModal from "../components/edit-profile-modal";

const Sidebar = () => {
  const { user, role, isReady } = useAuthReady();
  const toggleEditProfile = useToggleEditProfile();

  const profilePicture = useMemo(() => {
    const hasValidImage =
      isReady &&
      user?.imageUrl &&
      typeof user.imageUrl === "string" &&
      user.imageUrl.trim() !== "";

    return hasValidImage ? user.imageUrl : BlankProfilePicture;
  }, [isReady, user?.imageUrl]);

  const handleEditProfile = () => {
    if (user?.id) {
      toggleEditProfile(user.id);
    }
  };

  return (
    <>
      <aside className="w-full border-b border-gray-200 p-4 sm:w-72 sm:border-r sm:border-b-0 lg:p-6">
        <div className="flex items-center gap-4 sm:flex-col">
          <div className="flex flex-col items-start sm:items-center sm:text-center">
            {profilePicture && profilePicture !== "" ? (
              <Image
                src={profilePicture}
                alt="avatar"
                width={72}
                height={72}
                className="mb-2 h-16 w-16 rounded-full object-cover sm:h-18 sm:w-18"
                unoptimized={!profilePicture.startsWith("http")}
              />
            ) : (
              <div className="mb-2 flex h-16 w-16 items-center justify-center rounded-full bg-gray-200 sm:h-18 sm:w-18">
                <span className="text-xl font-bold text-gray-500 sm:text-2xl">
                  {user?.firstName?.[0]?.toUpperCase() || "U"}
                </span>
              </div>
            )}

            <div className="flex flex-col items-start sm:items-center">
              <h2 className="font-bricolage text-base font-bold capitalize sm:text-lg">
                {user?.firstName || "User"}
              </h2>
              <p className="font-bricolage text-xs text-neutral-600 capitalize sm:text-sm">
                {role?.toLowerCase() || "buyer"}
              </p>
            </div>

            <div className="mt-2 flex gap-1.5 text-sm text-neutral-700 sm:gap-2">
              <IconLocation className="h-4 w-4 sm:h-5 sm:w-5" />
              <p className="font-bricolage text-xs font-medium capitalize sm:text-sm">
                Nigeria
              </p>
            </div>

            <button
              onClick={handleEditProfile}
              className="font-bricolage relative mt-3 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 py-2.5 text-xs font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:bg-[#1a3474] active:scale-95 sm:mt-5 sm:w-fit sm:text-sm"
            >
              Edit profile information
            </button>
          </div>
        </div>
      </aside>

      {/* Edit Profile Modal */}
      {user?.id && <EditProfileModal userId={user.id} />}
    </>
  );
};

export default Sidebar;
