import { ApiClient } from "@/src/lib/api-client";
import { PERSONALIZE_OP } from "../../data/personalize.path";
import { IPersonalize } from "../../types/personalize.types";

export async function personalizeExperience(ctx: IPersonalize) {
  return await ApiClient.post(PERSONALIZE_OP.PERSONALIZE_EXP, ctx);
}
