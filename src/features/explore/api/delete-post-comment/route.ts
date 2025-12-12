import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { IDeleteComment } from "../../types/explore-comment.types";

export async function deletePostComment(ctx: IDeleteComment) {
  return await ApiClient.delete(EXPLORE_OP.DELETE_POST_COMMENT, ctx);
}
