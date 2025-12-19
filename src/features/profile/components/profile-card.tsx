"use client";
import { IconEye, IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import { formatViewCount } from "@/src/utils/number-format";
import { useRoleStore } from "../../auth/state/store";
import ProfileEditToggle from "./profile-edit-toggle";
import {
  useIsEditProfileToggled,
  useToggleEditProfile, // ← Add this import
} from "../artist/store/artist-profile.store";
import { BlankProfilePicture } from "@/src/constants/constants";

interface IProfileCard {
  id: number | string;
  title: string;
  views: string | number;
  createdAt: string;
  image: string;
  role?: string;
}

const ProfileCard: React.FC<IProfileCard> = ({
  id,
  title,
  views,
  createdAt,
  image,
}) => {
  const role = useRoleStore((state) => state.role);
  const isEditProfileToggled = useIsEditProfileToggled(id as string);
  const toggleEditProfile = useToggleEditProfile(); // ← Add this hook

  // Add click handler for edit button
  const handleEditClick = () => {
    console.log("✏️ Edit button clicked! ID:", id);
    toggleEditProfile(id as string);
  };

  return (
    <div className="relative mt-[30px] flex w-full flex-col px-4">
      <div className="absolute top-1 z-20 px-2">
        {role === "ARTIST" && (
          <ProfileEditToggle id={id as string} role={role} />
        )}
      </div>
      <div className="flex flex-col">
        <div className="relative">
          <Image
            src={image ? image : BlankProfilePicture}
            alt="user_asset"
            quality={100}
            width={400}
            height={300}
            className={`rounded-[15px] object-contain transition-all duration-300 select-none ${
              isEditProfileToggled ? "blur-xs" : ""
            }`}
          />
        </div>
        <div className="mt-2 flex w-full max-w-[400px] justify-between">
          <div className="flex flex-col items-start font-medium text-neutral-600">
            <h3 className="font-bricolage sm:text-normal text-sm font-bold text-neutral-900 capitalize">
              {title}
            </h3>
            <p className="font-mono text-xs font-light text-[#666666] capitalize">
              {createdAt}
            </p>
          </div>
          <div className="flex items-center gap-3 text-black">
            <div className="flex items-center gap-1">
              <IconEye width={15} height={15} />
              <p className="font-mono text-sm capitalize">
                {formatViewCount(views)}
              </p>
            </div>

            <button
              onClick={handleEditClick}
              className="flex cursor-pointer items-center gap-1 transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <IconPencil width={15} height={15} />
              <p className="font-mono text-xs capitalize sm:text-sm">Edit</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
