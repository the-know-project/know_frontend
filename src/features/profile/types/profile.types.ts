import { z } from "zod";
import { ArtistMetricsDto, FetchUserAsset } from "../artist/dto/artist.dto";

export type IArtistMetricsDto = z.infer<typeof ArtistMetricsDto>;
export type IFetchUserAsset = z.infer<typeof FetchUserAsset>;
