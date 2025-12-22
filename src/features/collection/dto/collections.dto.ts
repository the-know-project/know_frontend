import { z } from "zod";

export const Pagination = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1).max(100),
  totalItems: z.number(),
  itemsPerPage: z.number(),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const CollectionData = z.object({
  id: z.string(),
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  bannerUrl: z.string(),
  numOfArt: z.number(),
});

export const FetchAllCollectionsDto = z.object({
  userId: z.string().uuid(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export const FetchAllCollectionsResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(CollectionData),
  meta: Pagination,
});

export const FetchCollectionDto = z.object({
  userId: z.string().uuid(),
  collectionId: z.string().uuid(),
});

export const FetchCollectionAssetData = z.object({
  fileId: z.string(),
  assetUrl: z.string(),
  artTitle: z.string(),
  artDescription: z.string(),
  artCategories: z.array(z.string()).min(1),
  artTags: z.array(z.string()).optional(),
  artSize: z.object({
    width: z.number(),
    height: z.number(),
    weight: z.number(),
    depth: z.number().optional(),
    diameter: z.number().optional(),
    length: z.number().optional(),
    weightUnit: z.string().optional(),
    dimensionUnit: z.string().optional(),
  }),
  isArtListed: z.boolean(),
  isArtLocked: z.boolean(),
  numOfLikes: z.number().min(0),
  artistProfileUrl: z.string(),
  artCreatedAt: z.date(),
});

export const FetchCollectionData = z.object({
  id: z.string().uuid(),
  title: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  description: z.string().optional(),
  price: z.string(),
  tags: z.array(z.string()).optional(),
  numOfLikes: z.number().min(0),
  numOfArt: z.number().min(0),
  currency: z.string(),
  imageUrl: z.string().optional(),
  bannerUrl: z.string(),
  assetData: z.array(FetchCollectionAssetData).optional(),
});

export const FetchCollectionResponse = z.object({
  status: z.number(),
  message: z.string(),
  data: FetchCollectionData,
});
