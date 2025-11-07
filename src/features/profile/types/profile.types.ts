import { z } from "zod";
import { ArtistMetricsDto, FetchUserAsset } from "../artist/dto/artist.dto";
import { ArtistDetailsDtoSchema } from "../dto/profile.dto";

export type IArtistMetricsDto = z.infer<typeof ArtistMetricsDto>;
export type IFetchUserAsset = z.infer<typeof FetchUserAsset>;
export type TArtistDetailsDto = z.infer<typeof ArtistDetailsDtoSchema>;
