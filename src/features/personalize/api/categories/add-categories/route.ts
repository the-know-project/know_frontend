import { ApiClient } from "@/src/lib/api-client";
import { PERSONALIZE_OP } from "../../../data/personalize.path";

export async function addCategories(categories: string[]) {
  return ApiClient.post(PERSONALIZE_OP.ADD_CATEGORY, { categories });
}
