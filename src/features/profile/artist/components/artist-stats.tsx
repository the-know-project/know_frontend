import { audience } from "@/src/assets";
import Image from "next/image";
import ArtistAudienceStats from "./artist-audience-stats";

const Stats = () => {
  return (
    <section className="flex w-full flex-col">
      {/*Audience Stats*/}
      <div className="flex w-full flex-col">
        <div className="flex items-center gap-8">
          <Image
            src={audience}
            alt="audience"
            width={40}
            height={40}
            quality={100}
            priority
            className="object-center"
          />
          <h3 className="font-bricolage text-[20px] font-bold text-neutral-800 capitalize md:text-[24px]">
            Your audience
          </h3>
        </div>
        <ArtistAudienceStats />
      </div>
    </section>
  );
};

export default Stats;
