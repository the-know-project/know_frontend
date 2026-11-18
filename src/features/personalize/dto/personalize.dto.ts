import { z } from "zod";

export const GetCategoriesResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(255),
  data: z.array(z.string()),
});

export const AddCategoriesResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(255),
  data: z.array(z.string()),
});

export const PersonalizeResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(255),
});
