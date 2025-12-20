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
