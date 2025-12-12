import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { IPostComment } from "../../types/explore-comment.types";

export async function addPostComment(ctx: IPostComment) {
  return await ApiClient.post(EXPLORE_OP.ADD_POST_COMMENT, ctx);
}
