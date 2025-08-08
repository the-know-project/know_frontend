"use client";
import { useFetchArtistMetrics } from "../hooks/use-fetch-artist-metrics";
import { parseAudienceMetrics } from "../utils/parse-audience-data";

const ArtistAudienceStats = () => {
  const { data: metrics, isLoading: metricsLoading } = useFetchArtistMetrics();
  const audienceMetrics = parseAudienceMetrics({
    metrics: metrics,
    metricsLoading: metricsLoading,
  });

  return (
    <div className="flex w-full flex-col items-center py-9 md:flex-row">
      <div className="flex w-full flex-col items-center gap-[20px] md:flex-row md:gap-0">
        {audienceMetrics.map((metric) => (
          <div
            key={metric.id}
            className="flex w-full flex-row-reverse items-start justify-between md:flex-col md:items-center"
          >
            <h4 className="font-bricolage text-[20px] font-semibold text-neutral-800 capitalize md:text-[32px]">
              {metric.value}
            </h4>
            <p className="font-bricolage font-light text-[#666666] capitalize">
              {metric.context}
            </p>
            <hr className="mt-5 hidden w-full border-t border-neutral-200 md:block" />
          </div>
        ))}
        <hr className="mt-5 block w-full border-t border-neutral-200 md:hidden" />
      </div>
    </div>
  );
};

export default ArtistAudienceStats;
