import { ApiClient } from "@/src/lib/api-client";
import { PERSONALIZE_OP } from "../../../data/personalize.path";

export async function getCategories() {
  return await ApiClient.get(PERSONALIZE_OP.GET_CATEGORIES);
}
