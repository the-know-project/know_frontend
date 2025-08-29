import { z } from "zod";
import {
  FetchSalesDataSchema,
  IncrementViewCountSchema,
} from "../schema/metrics.schema";

export type IIncrementViewCount = z.infer<typeof IncrementViewCountSchema>;
export type IFetchArtistSalesData = z.infer<typeof FetchSalesDataSchema>;
