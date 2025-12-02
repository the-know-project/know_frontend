// features/explore/api/add-post-comment.api.ts
import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { TAddComment } from "../../types/explore.types";

export async function addPostComment(ctx: TAddComment) {
  return await ApiClient.post(EXPLORE_OP.ADD_POST_COMMENT, ctx);
}
