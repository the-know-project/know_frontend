import { z } from "zod";

export const MonthlySalesData = z.object({
  salesValue: z.string(),
  month: z.string(),
});

export const YearlySalesData = z.object({
  salesValue: z.string(),
  YearlySalesData: z.string(),
});

export const ArtistMonthlySalesDataResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(MonthlySalesData),
});

export const ArtistYearlySalesDataResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(YearlySalesData),
});
