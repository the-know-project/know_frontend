import { IconThumbUp, IconThumbUpFilled } from "@tabler/icons-react";
import Image from "next/image";

interface ExploreCardProps {
  id: number | string;
  artistName: string;
  artName: string;
  artWork: string;
  artistImage: string;
  likeCount: number;
}

const ExploreCard: React.FC<ExploreCardProps> = ({
  id,
  artistName,
  artName,
  artWork,
  artistImage,
  likeCount,
}) => {
  return (
    <div className="flex h-[300px] w-full max-w-[500px] flex-col gap-2 rounded-[15px] px-6 py-3">
      <div className="flex w-full flex-col rounded-[15px] shadow-sm">
        <Image
          src={artWork}
          alt="Artwork"
          quality={100}
          width={500}
          height={300}
          className="rounded-[15px] object-cover"
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="explore_logo_wrapper">
            <Image
              src={artistImage}
              alt="logo"
              width={30}
              height={30}
              className="rounded-full object-contain object-center"
            />
          </div>

          <div className="flex flex-col items-start">
            <p className="font-bricolage text-[20px] text-black capitalize">
              {artistName}
            </p>
            <h3 className="font-bricolage text-sm font-semibold text-neutral-900 underline">
              {artName}
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {likeCount > 0 ? (
            <IconThumbUpFilled
              width={30}
              height={30}
              className="text-neutral-700"
            />
          ) : (
            <IconThumbUp width={30} height={30} className="text-neutral-500" />
          )}

          <p className="font-bricolage text-[16px] font-bold text-neutral-900">
            {likeCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
