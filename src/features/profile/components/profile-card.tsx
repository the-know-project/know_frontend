import { IconEye, IconPencil } from "@tabler/icons-react";
import Image from "next/image";
import { formatViewCount } from "@/src/utils/number-format";

interface IProfileCard {
  id: number | string;
  title: string;
  views: string | number;
  createdAt: string;
  image: string;
}

const ProfileCard: React.FC<IProfileCard> = ({
  id,
  title,
  views,
  createdAt,
  image,
}) => {
  return (
    <div className="mt-[30px] flex w-full flex-col px-4">
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
            <h3 className="font-bricolage sm:text-normal text-sm capitalize">
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
