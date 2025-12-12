import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";
import { IFetchPostComments } from "../../types/explore-comment.types";

export async function fetchPostComments(ctx: IFetchPostComments) {
  const { fileId, page = 1, limit = 10 } = ctx;
  const path = `${EXPLORE_OP.FETCH_POST_COMMENTS}?fileId=${fileId}&page=${page}&limit=${limit}`;
  return await ApiClient.get(path);
}
