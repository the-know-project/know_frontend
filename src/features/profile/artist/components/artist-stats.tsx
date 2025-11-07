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

const Stats = () => {
  const { data: metrics, isLoading: metricsLoading } = useFetchArtistMetrics();

  if (metricsLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
          <p className="font-bricolage text-sm text-gray-500">
            Loading your stats...
          </p>
        </div>
      </div>
    );
  }

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
      {/* Audience Stats */}
      <div className="flex w-full flex-col py-12">
        <div className="flex items-center gap-8">
          <div className="rounded-full bg-orange-100 p-2">
            <FaPeopleGroup className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="stats_title">Your audience</h3>
        </div>
        <ArtistAudienceStats audienceMetrics={audienceMetrics} />
      </div>

      {/* Engagement Insights */}
      <div className="flex w-full flex-col">
        <EngagementInsights
          topInterestedBuyers={insightMetrics.topInterestedBuyer}
          conversionRate={insightMetrics.conversionRate}
        />
      </div>

      {/* Sales Stats */}
      <div className="flex w-full flex-col">
        <ArtistSalesStats />
      </div>

      {/* Post Performance - Now Dynamic! ✨ */}
      <div className="flex w-full flex-col">
        <ArtistPerformance />
      </div>
    </section>
  );
};

export default Stats;
