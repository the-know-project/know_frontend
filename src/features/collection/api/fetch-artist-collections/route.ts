import { IFetchAllCollections } from "@/src/features/profile/artist/types/collections.types";
import { COLLECTION_OP } from "@/src/features/profile/data/collection.route";
import { ApiClient } from "@/src/lib/api-client";

export async function fetchArtistCollections(ctx: IFetchAllCollections) {
  const { userId, page = 1, limit = 12 } = ctx;
  const path = `${COLLECTION_OP.FETCH_ALL_COLLECTIONS}?userId=${userId}&page=${page}&limit=${limit}`;

  return ApiClient.get(path);
}
