import { ApiClient } from "@/src/lib/api-client";

import { IFetchProfileData } from "../../artist/types/profile.types";
import { TUserProfileDto } from "../../types/profile.types";

const ARTIST_PROFILE_ENDPOINT = "/api/user/userById";

export async function fetchProfile(
  ctx: IFetchProfileData,
): Promise<TUserProfileDto> {
  const path = `${ARTIST_PROFILE_ENDPOINT}?userId=${ctx.userId as string}&viewerId=${ctx.viewerId as string}`;
  return await ApiClient.get(path);
}
