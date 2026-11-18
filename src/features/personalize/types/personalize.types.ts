import { z } from "zod";
import { PersonalizeSchema } from "../schema/personalize.schema";
import {
  AddCategoriesResponseDto,
  GetCategoriesResponseDto,
} from "../dto/personalize.dto";

export type IPersonalize = z.infer<typeof PersonalizeSchema>;
export type IGetCategoriesResponseDto = z.infer<
  typeof GetCategoriesResponseDto
>;
export type IAddCategoriesResponseDto = z.infer<
  typeof AddCategoriesResponseDto
>;
