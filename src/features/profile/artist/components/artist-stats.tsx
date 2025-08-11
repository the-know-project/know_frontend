import { audience } from "@/src/assets";
import Image from "next/image";
import ArtistAudienceStats from "./artist-audience-stats";
import EngagementInsights from "./engagement-insights";

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
          <h3 className="stats_title">Your audience</h3>
        </div>
        <ArtistAudienceStats />
      </div>

      {/*Engagement Insights*/}
      <div className="flex w-full flex-col">
        <EngagementInsights />
      </div>
    </section>
  );
};

export default Stats;
