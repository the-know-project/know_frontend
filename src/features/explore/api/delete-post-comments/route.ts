import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { TDeleteComment } from "../../types/explore.types";

export async function deletePostComment(ctx: TDeleteComment) {
  return await ApiClient.delete(EXPLORE_OP.DELETE_POST_COMMENT, {
    data: ctx,
  });
}