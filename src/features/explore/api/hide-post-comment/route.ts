import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { IHideComment } from "../../types/explore-comment.types";

export async function hidePostComment(ctx: Omit<IHideComment, "fileId">) {
  return await ApiClient.patch(EXPLORE_OP.HIDE_POST_COMMENT, ctx);
}
