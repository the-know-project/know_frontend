// import { Eye, MessageCircle, Edit2 } from "luci";
import { FaEye } from "react-icons/fa";
import { FaRegMessage } from "react-icons/fa6";
import { CiEdit } from "react-icons/ci";
import Image from "next/image";
import { IconEye, IconPencil } from "@tabler/icons-react";

interface IProfileCard {
  id: number | string;
  title: string;
  views: string;
  comments: number;
  createdAt: string;
  image: string;
}

const ProfileCard: React.FC<IProfileCard> = ({
  id,
  title,
  views,
  comments,
  createdAt,
  image,
}) => {
  return (
    <div className="flex h-[400px] w-[500px] flex-col">
      <Image
        src={image}
        alt={title}
        quality={100}
        width={500}
        height={300}
        className="rounded-[15px] object-contain select-none"
      />

      <div className="mt-2 flex justify-between">
        <div className="flex flex-col items-start font-medium text-neutral-600">
          <h3 className="font-bricolage capitalize">{title}</h3>
          <p className="font-bricolage text-sm capitalize">{createdAt}</p>
        </div>

        <div className="flex items-center gap-3 text-black">
          <div className="flex items-center gap-1">
            <IconEye width={15} height={15} />
            <p className="font-bricolage text-sm capitalize">{views}</p>
          </div>
          <div className="flex items-center gap-1">
            <IconPencil width={15} height={15} />
            <p className="font-bricolage text-sm capitalize">Edit</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
