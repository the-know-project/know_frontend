import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";

export async function addPostComment(postId: string, comment: string) {
  return await ApiClient.post(EXPLORE_OP.ADD_POST_COMMENT, { postId, comment });
}