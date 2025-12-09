import { z } from "zod";
import {
  ArtistMonthlySalesDataResponse,
  ArtistYearlySalesDataResponse,
  FetchUserFollowingResponse,
  FollowUserResponse,
  FollowingData,
  ValidateFollowingResponse,
} from "../dto/metrics.dto";
import {
  FetchSalesDataSchema,
  FetchUserFollowersSchema,
  FollowSchema,
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

export type IFollowingData = z.infer<typeof FollowingData>;
export type IFollowUser = z.infer<typeof FollowSchema>;
export type IUnFollowUser = z.infer<typeof FollowSchema>;
export type IFetchUserFollowers = z.infer<typeof FetchUserFollowersSchema>;
export type IFetchUserFollowing = z.infer<typeof FetchUserFollowersSchema>;
export type IFetchUserFollowingResponse = z.infer<
  typeof FetchUserFollowingResponse
>;
export type IValidateUserFollowing = z.infer<typeof FollowSchema>;
export type IFollowUserResponseDto = z.infer<typeof FollowUserResponse>;
export type IValidateFollowingResponse = z.infer<
  typeof ValidateFollowingResponse
>;
