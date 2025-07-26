"use client";

import { IconEye, IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import { formatViewCount } from "@/src/utils/number-format";
import { useRoleStore } from "../../auth/state/store";
import ProfileEditToggle from "./profile-edit-toggle";

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
  return (
    <div className={`relative mt-[30px] flex w-full flex-col px-4`}>
      <div className="absolute top-1 z-20 px-2">
        {role === "ARTIST" && (
          <ProfileEditToggle id={id as string} role={role} />
        )}
      </div>
      <div className="flex flex-col">
        <Image
          src={image}
          alt="user_asset"
          quality={100}
          width={400}
          height={300}
          className="rounded-[15px] object-contain select-none"
        />

        <div className="mt-2 flex w-full max-w-[400px] justify-between">
          <div className="flex flex-col items-start font-medium text-neutral-600">
            <h3 className="font-bricolage sm:text-normal text-sm text-neutral-800 capitalize">
              {title}
            </h3>
            <p className="font-bricolage text-xs capitalize sm:text-sm">
              {createdAt}
            </p>
          </div>

          <div className="flex items-center gap-3 text-black">
            <div className="flex items-center gap-1">
              <IconEye width={15} height={15} />
              <p className="font-bricolage text-sm capitalize">
                {formatViewCount(views)}
              </p>
            </div>
            <div className="flex items-center gap-1">
              <IconPencil width={15} height={15} />
              <p className="font-bricolage text-xs capitalize sm:text-sm">
                Edit
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
