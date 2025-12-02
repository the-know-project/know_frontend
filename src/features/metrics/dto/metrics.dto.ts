import { z } from "zod";
import { Pagination } from "../../explore/dto/explore.dto";

export const MonthlySalesData = z.object({
  salesValue: z.string(),
  month: z.string(),
});

export const YearlySalesData = z.object({
  salesValue: z.string(),
  YearlySalesData: z.string(),
});

export const FollowingData = z.object({
  id: z.string().uuid(),
  username: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  imageUrl: z.string().url().optional(),
  role: z.string(),
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

export const FetchUserFollowingResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(FollowingData),
  meta: Pagination,
});

export const FollowUserResponse = z.object({
  status: z.number(),
  message: z.string(),
});

export const ValidateFollowingResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.boolean(),
});
