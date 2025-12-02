// features/explore/api/hide-post-comment.api.ts
import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { THideComment } from "../../types/explore.types";

export async function hidePostComment(ctx: THideComment) {
  return await ApiClient.post(EXPLORE_OP.HIDE_POST_COMMENT, ctx);
}