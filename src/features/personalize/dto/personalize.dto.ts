import { z } from "zod";

export const GetCategoriesResponse = z.object({
  status: z.number(),
  message: z.string().min(1).max(255),
  data: z.array(z.string().min(1).max(255)),
  meta: z
    .object({
      total: z.number().min(0),
      page: z.number().min(1),
      limit: z.number().min(1).max(100),
    })
    .nullable(),
});
