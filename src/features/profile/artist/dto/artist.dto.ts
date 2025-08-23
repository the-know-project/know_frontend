import { z } from "zod";

const insightData = z.object({
  topInterestedBuyersByPercentage: z.string(),
  conversionRateByPercentage: z.string(),
});

export const MetricsData = z.object({
  id: z.string().uuid(),
  followerCount: z.number(),
  followingCount: z.number(),
  totalSalesValue: z.number(),
  itemsSold: z.number(),
  activeListings: z.number(),
  postViews: z.number(),
  profileViews: z.number(),
  lastSaleDate: z.date(),
  insight: insightData,
});

export const UserAssetData = z.object({
  fileId: z.string(),
  name: z.string(),
  description: z.string().max(255).optional(),
  fileType: z.string(),
  firstName: z.string().max(255).optional(),
  lastName: z.string().max(255).optional(),
  price: z.number().min(0),
  availability: z.boolean(),
  categories: z.array(z.string()),
  createdAt: z.date(),
  isListed: z.boolean(),
  isLocked: z.boolean(),
  url: z.string().url(),
  size: z.object({
    width: z.number(),
    height: z.number(),
    weight: z.number(),
    depth: z.number().optional(),
    diameter: z.number().optional(),
    length: z.number().optional(),
    weightUnit: z.string().optional(),
    dimensionUnit: z.string().optional(),
  }),
  tags: z.array(z.string()),
  numOfLikes: z.number(),
  numOfViews: z.number(),
});

export const Pagination = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1).max(100),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const ArtistMetricsDto = z.object({
  status: z.number(),
  message: z.string(),
  data: MetricsData.optional(),
});

export const ArtistAssetDto = z.object({
  status: z.number(),
  message: z.string(),
  data: z.object({
    assets: z.array(UserAssetData),
    pagination: Pagination,
  }),
});

export const FetchUserAsset = z.object({
  userId: z.string().uuid(),
  page: z.number().optional().default(1),
  limit: z.number().min(1).optional().default(12),
});

export type TUserAssetData = z.infer<typeof UserAssetData>;
