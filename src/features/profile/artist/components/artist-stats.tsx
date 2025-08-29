"use client";

import { audience } from "@/src/assets";
import Image from "next/image";
import ArtistAudienceStats from "./artist-audience-stats";
import EngagementInsights from "./engagement-insights";
import { useFetchArtistMetrics } from "../../../metrics/hooks/use-fetch-artist-metrics";
import { showLog } from "@/src/utils/logger";
import {
  parseAudienceMetrics,
  parseInsightData,
} from "../utils/parse-audience-data";

const Stats = () => {
  const { data: metrics, isLoading: metricsLoading } = useFetchArtistMetrics();
  showLog({
    context: `Artist Metrics`,
    data: metrics,
  });

  if (metricsLoading) return <div>Loading...</div>;
  const audienceMetrics = parseAudienceMetrics({
    metrics: metrics,
    metricsLoading: metricsLoading,
  });

  const insightMetrics = parseInsightData({
    metrics: metrics,
    metricsLoading: metricsLoading,
  });

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
        <ArtistAudienceStats audienceMetrics={audienceMetrics} />
      </div>

      {/*Engagement Insights*/}
      <div className="flex w-full flex-col">
        <EngagementInsights
          topInterestedBuyers={insightMetrics.topInterestedBuyer}
          conversionRate={insightMetrics.conversionRate}
        />
      </div>
    </section>
  );
};

export default Stats;
