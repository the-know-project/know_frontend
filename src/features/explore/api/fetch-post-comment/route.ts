import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";

export async function fetchPostComments(postId: string, page: number = 1) {
  const path = `${EXPLORE_OP.FETCH_POST_COMMENTS}?postId=${postId}&page=${page}`;
  return await ApiClient.get(path);
}