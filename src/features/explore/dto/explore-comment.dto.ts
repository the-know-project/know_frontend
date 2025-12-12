import { z } from "zod";

export const exploreComment = z.object({
  id: z.string(),
  userId: z.string().uuid(),
  firstName: z.string(),
  lastName: z.string(),
  profilePicture: z.string().nullable(),
  comment: z.string(),
  createdAt: z.number(),
  fileId: z.string().optional(),
});

export const meta = z.object({
  currentPage: z.number().min(1),
  totalPages: z.number().min(1),
  totalItems: z.number().min(1),
  itemsPerPage: z.number().min(10),
  hasNextPage: z.boolean(),
  hasPreviousPage: z.boolean(),
});

export const comments = z.object({
  status: z.number(),
  message: z.string(),
  data: z.array(exploreComment),
  meta: meta,
});
