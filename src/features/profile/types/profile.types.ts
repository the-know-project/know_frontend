import { z } from "zod";
import { ArtistMetricsDto, FetchUserAsset } from "../artist/dto/artist.dto";
import {
  ArtistDetailsDtoSchema,
  ProfileFormSchema,
  UpdateProfileResponseDto,
} from "../dto/profile.dto";

export type IArtistMetricsDto = z.infer<typeof ArtistMetricsDto>;
export type IFetchUserAsset = z.infer<typeof FetchUserAsset>;
export type TArtistDetailsDto = z.infer<typeof ArtistDetailsDtoSchema>;
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
export type IUpdateProfileResponseDto = z.infer<
  typeof UpdateProfileResponseDto
>;
