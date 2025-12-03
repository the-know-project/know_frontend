import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";

export async function hidePostComment(commentId: string) {
  return await ApiClient.patch(EXPLORE_OP.HIDE_POST_COMMENT, { commentId });
}