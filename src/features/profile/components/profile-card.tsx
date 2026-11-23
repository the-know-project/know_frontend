"use client";
import { IconEye, IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import { formatViewCount } from "@/src/utils/number-format";
import { useRoleStore } from "../../auth/state/store";
import ProfileEditToggle from "./profile-edit-toggle";
import { useIsEditProfileToggled } from "../artist/store/artist-profile.store";
import { BlankProfilePicture } from "@/src/constants/constants";

interface IProfileCard {
  id: number | string;
  title: string;
  views: string | number;
  createdAt: string;
  image: string;
  role?: string;

  isListed: boolean;
  onClick?: () => void;
  onEditPost?: () => void;
  showEditControls?: boolean;
}

const ProfileCard: React.FC<IProfileCard> = ({
  id,
  title,
  views,
  createdAt,
  image,
  isListed,
  onClick,
  onEditPost,
  showEditControls = true,
}) => {
  const role = useRoleStore((state) => state.role);
  const isEditProfileToggled = useIsEditProfileToggled(id as string);

  return (
    <article className="relative mt-3 flex w-full min-w-0 flex-col sm:mt-4">
      <div className="absolute top-3 left-3 z-20">
        {showEditControls && role === "ARTIST" && (
          <ProfileEditToggle
            image={image}
            id={id as string}
            isListed={isListed}
            onEditPost={onEditPost}
          />
        )}
      </div>
      <div className="flex min-w-0 flex-col">
        <div className="artwork-oak-frame group relative w-full shadow-lg transition-transform duration-300 hover:-translate-y-0.5 active:scale-[0.99]">
          <div className="artwork-oak-mat aspect-[4/3] w-full overflow-hidden">
            {onClick ? (
              <button
                type="button"
                onClick={onClick}
                aria-label={`View details for ${title}`}
                className="absolute inset-0 z-0 block h-full w-full focus-visible:ring-4 focus-visible:ring-indigo-500 focus-visible:outline-none focus-visible:ring-inset"
              >
                <Image
                  src={image || BlankProfilePicture}
                  alt={title ? `Artwork: ${title}` : "Artwork"}
                  quality={90}
                  fill
                  sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                  className={`object-contain transition-transform duration-300 select-none group-hover:scale-[1.02] ${
                    showEditControls && isEditProfileToggled ? "blur-xs" : ""
                  }`}
                />
                <span className="font-grotesk pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent px-3 pt-8 pb-3 text-left text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100">
                  View artwork
                </span>
              </button>
            ) : (
              <Image
                src={image || BlankProfilePicture}
                alt={title ? `Artwork: ${title}` : "Artwork"}
                quality={90}
                fill
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                className={`object-contain transition-transform duration-300 select-none group-hover:scale-[1.02] ${
                  showEditControls && isEditProfileToggled ? "blur-xs" : ""
                }`}
              />
            )}
          </div>
        </div>
        <div className="mt-3 flex w-full min-w-0 items-center justify-between gap-3">
          <div className="flex min-w-0 flex-col items-start">
            <h3 className="font-helvetica w-full truncate text-sm text-neutral-900 capitalize sm:text-base">
              {title}
            </h3>
            <p className="font-grotesk mt-0.5 text-xs text-neutral-500">
              {createdAt}
            </p>
          </div>
          <div className="flex shrink-0 items-center gap-2 sm:gap-3">
            <div className="flex items-center gap-1">
              <IconEye width={15} height={15} className="text-neutral-600" />
              <p className="font-grotesk text-xs text-neutral-600">
                {formatViewCount(views)}
              </p>
            </div>

            {showEditControls && (
              <button
                type="button"
                onClick={onEditPost}
                aria-label={`Edit ${title}`}
                className="font-grotesk inline-flex min-h-9 items-center gap-1 rounded-lg px-2 text-xs font-medium text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:outline-none"
              >
                <IconPencil
                  width={15}
                  height={15}
                  className="text-neutral-600"
                />
                <span>Edit</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export default ProfileCard;
