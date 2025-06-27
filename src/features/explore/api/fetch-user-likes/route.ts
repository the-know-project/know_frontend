import { ApiClient } from "@/src/lib/api-client";
import { EXPLORE_OP } from "../../data/explore.route";

export async function fetchUserLikes(userId: string) {
  const path = `${EXPLORE_OP.FETCH_USER_LIKES}?userId=${userId}`;
  return await ApiClient.get(path);
}
