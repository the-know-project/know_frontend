"use client";
import { showLog } from "@/src/utils/logger";
import { useFetchArtistMetrics } from "../hooks/use-fetch-artist-metrics";
import { parseAudienceMetrics } from "../utils/parse-audience-data";

interface IAudienceStats {
  id: number;
  context: string;
  value: number;
}

interface IArtistAudienceStats {
  audienceMetrics: IAudienceStats[];
}

const ArtistAudienceStats: React.FC<IArtistAudienceStats> = ({
  audienceMetrics,
}) => {
  return (
    <div className="flex w-full flex-col items-center py-9 md:flex-row">
      <div className="flex w-full flex-col items-center gap-[20px] md:flex-row md:gap-0">
        {audienceMetrics.map((metric, index) => (
          <div
            key={metric.id}
            className="motion-preset-expand motion-duration-200 flex w-full flex-row-reverse items-start justify-between md:flex-col md:items-center"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <h4 className="font-bricolage text-[20px] font-semibold text-neutral-800 capitalize md:text-[32px]">
              {metric.value}
            </h4>
            <p className="stats_content">{metric.context}</p>
            <hr className="mt-7 hidden w-full border-t border-neutral-200 md:block" />
          </div>
        ))}
        <hr className="mt-7 block w-full border-t border-neutral-200 md:hidden" />
      </div>
    </div>
  );
};

export default ArtistAudienceStats;
