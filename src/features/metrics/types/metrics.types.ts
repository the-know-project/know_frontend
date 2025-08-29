import { z } from "zod";
import {
  ArtistMonthlySalesDataResponse,
  ArtistYearlySalesDataResponse,
} from "../dto/metrics.dto";
import {
  FetchSalesDataSchema,
  IncrementViewCountSchema,
  SalesDurationSchema,
} from "../schema/metrics.schema";

export type IIncrementViewCount = z.infer<typeof IncrementViewCountSchema>;
export type IFetchArtistSalesData = z.infer<typeof FetchSalesDataSchema>;
export type ISalesDuration = z.infer<typeof SalesDurationSchema>;
export type IArtistMonthlySalesDataResponse = z.infer<
  typeof ArtistMonthlySalesDataResponse
>;
export type IArtistYearlySalesDataResponse = z.infer<
  typeof ArtistYearlySalesDataResponse
>;
