import { IconHeart, IconHeartFilled } from "@tabler/icons-react";
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
              className="object-contain object-center"
            />
          </div>

          <div className="flex flex-col items-start">
            <h3 className="font-bebas text-sm text-neutral-700">{artName}</h3>
            <p className="font-helvetica text-[16px] font-black text-neutral-900 uppercase">
              {artistName}
            </p>
          </div>
        </div>

        <div className="explore_logo_wrapper flex items-center gap-2">
          {likeCount > 0 ? (
            <IconHeartFilled width={30} height={30} className="text-red-600" />
          ) : (
            <IconHeart width={30} height={30} className="text-neutral-700" />
          )}

          <p className="font-bebas text-[16px] font-bold text-neutral-900">
            {likeCount}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExploreCard;
