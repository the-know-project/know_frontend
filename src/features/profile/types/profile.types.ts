import { z } from "zod";
import { ArtistMetricsDto, FetchUserAsset } from "../artist/dto/artist.dto";
import {
  UserProfileSchema,
  ProfileFormSchema,
  UpdateProfileResponseDto,
} from "../dto/profile.dto";

export type IArtistMetricsDto = z.infer<typeof ArtistMetricsDto>;
export type IFetchUserAsset = z.infer<typeof FetchUserAsset>;
export type TUserProfileDto = z.infer<typeof UserProfileSchema>;
export type ProfileFormData = z.infer<typeof ProfileFormSchema>;
export type IUpdateProfileResponseDto = z.infer<
  typeof UpdateProfileResponseDto
>;
