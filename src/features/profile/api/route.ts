import { ApiClient } from "@/src/lib/api-client";
import { TArtistDetailsDto } from "../types/profile.types";

const ARTIST_PROFILE_ENDPOINT = "/api/user/userById";

export async function fetchArtistDetails(
  artistId: string,
): Promise<TArtistDetailsDto> {
  const path = `${ARTIST_PROFILE_ENDPOINT}?userId=${artistId}`;
  return await ApiClient.get(path);
}  