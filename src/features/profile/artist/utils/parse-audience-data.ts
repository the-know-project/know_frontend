import { IArtistMetricsDto } from "../../types/profile.types";
import { ArtistError } from "../error/artist.error";

export interface IParseAudienceMetrics {
  metrics:
    | IArtistMetricsDto
    | ArtistError
    | "An error occurred while fetching artist metrics"
    | undefined;
  metricsLoading: boolean;
}

export function parseAudienceMetrics(ctx: IParseAudienceMetrics) {
  const { metrics, metricsLoading } = ctx;
  const isValidMetrics =
    metrics && typeof metrics === "object" && "data" in metrics;
  const postViews = metricsLoading
    ? 0
    : isValidMetrics
      ? (metrics.data?.postViews ?? 0)
      : 0;
  const followers = metricsLoading
    ? 0
    : isValidMetrics
      ? (metrics.data?.followerCount ?? 0)
      : 0;
  const following = metricsLoading
    ? 0
    : isValidMetrics
      ? (metrics.data?.followingCount ?? 0)
      : 0;
  const profileViews = metricsLoading
    ? 0
    : isValidMetrics
      ? (metrics.data?.profileViews ?? 0)
      : 0;

  const AudienceData = [
    {
      id: 1,
      context: "Followers",
      value: followers,
    },
    {
      id: 2,
      context: "Post Views",
      value: postViews,
    },
    {
      id: 3,
      context: "Following",
      value: following,
    },
    {
      id: 4,
      context: "Profile Views",
      value: profileViews,
    },
  ];

  return AudienceData;
}

export function parseInsightData(ctx: IParseAudienceMetrics) {
  const { metrics, metricsLoading } = ctx;
  const isValidMetrics =
    metrics && typeof metrics === "object" && "data" in metrics;

  const topInterestedBuyer = metricsLoading
    ? 0
    : isValidMetrics
      ? (Number(metrics.data?.insight.topInterestedBuyersByPercentage) ??
        50 / 100)
      : 50 / 100;

  const conversionRate = metricsLoading
    ? 0
    : isValidMetrics
      ? (Number(metrics.data?.insight.conversionRateByPercentage) ?? 50 / 100)
      : 50 / 100;

  return {
    topInterestedBuyer,
    conversionRate,
  };
}
