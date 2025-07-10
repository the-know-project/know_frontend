import { z } from "zod";

export const ArtistMetricsDto = z.object({
  id: z.string().uuid(),
  followerCount: z.number(),
  totalSalesValue: z.number(),
  itemsSold: z.number(),
  activeListings: z.number(),
  postViews: z.number(),
  profileViews: z.number(),
  lastSaleDate: z.date(),
});
