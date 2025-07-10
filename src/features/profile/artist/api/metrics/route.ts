import { ApiClient } from "@/src/lib/api-client";
import { PROFILE_OP } from "../../../data/profile.route";

export async function fetchArtistMetrics(userId: string) {
  const path = `${PROFILE_OP.USER_METRICS}?userId=${userId}`;
  return ApiClient.get(path);
}
