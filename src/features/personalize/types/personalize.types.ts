import { z } from "zod";
import { PersonalizeSchema } from "../schema/personalize.schema";
import { GetCategoriesResponseDto } from "../dto/personalize.dto";

export type IPersonalize = z.infer<typeof PersonalizeSchema>;
export type IGetCategoriesResponseDto = z.infer<
  typeof GetCategoriesResponseDto
>;
