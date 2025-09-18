"use client";

import ArtistAudienceStats from "./artist-audience-stats";
import EngagementInsights from "./engagement-insights";
import { useFetchArtistMetrics } from "../../../metrics/hooks/use-fetch-artist-metrics";
import {
  parseAudienceMetrics,
  parseInsightData,
} from "../utils/parse-audience-data";
import ArtistSalesStats from "./artist-sales-stats";
import { FaPeopleGroup } from "react-icons/fa6";
import ArtistPerformance from "./artist-performance";
import { DummyPostsPerformance } from "../data/artist.data";

const Stats = () => {
  const { data: metrics, isLoading: metricsLoading } = useFetchArtistMetrics();

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
      <div className="flex w-full flex-col py-12">
        <div className="flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <FaPeopleGroup className="h-5 w-5 text-orange-500" />
          </div>
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

      <div className="flex w-full flex-col">
        <ArtistSalesStats />
      </div>

      <div className="flex w-full flex-col">
        <ArtistPerformance posts={DummyPostsPerformance} />
      </div>
    </section>
  );
};

export default Stats;
