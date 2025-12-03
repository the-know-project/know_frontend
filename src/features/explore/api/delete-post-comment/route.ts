import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";

export async function deletePostComment(commentId: string) {
  return await ApiClient.delete(EXPLORE_OP.DELETE_POST_COMMENT, { 
    data: { commentId } 
  });
}