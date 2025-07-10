import { z } from "zod";

export const MetricsData = z.object({
  id: z.string().uuid(),
  followerCount: z.number(),
  totalSalesValue: z.number(),
  itemsSold: z.number(),
  activeListings: z.number(),
  postViews: z.number(),
  profileViews: z.number(),
  lastSaleDate: z.date(),
});

export const ArtistMetricsDto = z.object({
  status: z.number(),
  message: z.string(),
  data: MetricsData.optional(),
});
