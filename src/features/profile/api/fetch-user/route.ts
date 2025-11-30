import { ApiClient } from "@/src/lib/api-client";
import { TArtistDetailsDto } from "../../types/profile.types";
import { IFetchProfileData } from "../../artist/types/profile.types";

const ARTIST_PROFILE_ENDPOINT = "/api/user/userById";

export async function fetchArtistDetails(
  ctx: IFetchProfileData,
): Promise<TArtistDetailsDto> {
  const path = `${ARTIST_PROFILE_ENDPOINT}?userId=${ctx.userId as string}&viewerId=${ctx.viewerId as string}`;
  return await ApiClient.get(path);
}
