"use client";

import ArtistAudienceStats from "./artist-audience-stats";

import { useFetchArtistMetrics } from "../../../metrics/hooks/use-fetch-artist-metrics";
import {
  parseAudienceMetrics,
  parseInsightData,
} from "../utils/parse-audience-data";
import ArtistSalesStats from "./artist-sales-stats";
import { FaPeopleGroup } from "react-icons/fa6";

import EngagementInsights from "./engagement-insights";
import { PostPerformanceDashboard } from "./artist-performance";

const Stats = () => {
  const {
    data: metrics,
    isLoading: metricsLoading,
    isError,
    refetch,
  } = useFetchArtistMetrics();

  if (metricsLoading) {
    return (
      <section
        aria-label="Loading artist statistics"
        className="w-full animate-pulse space-y-8 py-8"
      >
        <div>
          <div className="h-7 w-40 rounded-lg bg-neutral-200" />
          <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-24 rounded-2xl border border-neutral-100 bg-white"
              />
            ))}
          </div>
        </div>
        <div className="h-52 rounded-2xl bg-neutral-100" />
      </section>
    );
  }

  const hasMetricsData =
    metrics &&
    typeof metrics === "object" &&
    "data" in metrics &&
    Boolean(metrics.data);

  if (isError || !hasMetricsData) {
    return (
      <section className="flex w-full flex-col items-center rounded-2xl border border-neutral-200 bg-white px-5 py-10 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
          <FaPeopleGroup className="h-5 w-5" />
        </div>
        <h2 className="font-helvetica mt-4 text-lg font-bold text-neutral-900">
          Your stats are unavailable right now
        </h2>
        <p className="font-grotesk mt-1 max-w-sm text-sm leading-6 text-neutral-500">
          Check your connection and try loading the statistics again.
        </p>
        <button
          type="button"
          onClick={() => void refetch()}
          className="font-grotesk mt-5 min-h-11 rounded-xl bg-neutral-900 px-5 text-sm font-semibold text-white transition hover:bg-neutral-700"
        >
          Retry
        </button>
      </section>
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
      <div className="flex w-full flex-col py-7 sm:py-10">
        <div className="mb-5 flex items-center gap-3 sm:mb-6">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100">
            <FaPeopleGroup className="h-5 w-5 text-orange-500" />
          </div>
          <h3 className="font-helvetica text-xl font-bold text-neutral-900 capitalize md:text-2xl">
            Your audience
          </h3>
        </div>
        <ArtistAudienceStats audienceMetrics={audienceMetrics} />
      </div>

      {/* Engagement Insights */}
      <div className="flex w-full flex-col">
        <EngagementInsights
          viewsPerFollower={insightMetrics.viewsPerFollower}
          conversionRate={insightMetrics.conversionRate}
        />
      </div>

      {/* Sales Stats */}
      <div className="flex w-full flex-col">
        <ArtistSalesStats />
      </div>

      <div className="flex w-full flex-col py-7 sm:py-10">
        <div className="mb-6">
          <h3 className="stats_title">Post Performance</h3>
          <p className="font-grotesk mt-2 text-sm text-neutral-500">
            Track orders and comments across your artwork.
          </p>
        </div>
        <PostPerformanceDashboard />
      </div>
    </section>
  );
};

export default Stats;
