import { COLLECTION_OP } from "@/src/features/profile/data/collection.route";
import { IFetchAllCollections } from "../../../types/collections.types";
import { ApiClient } from "@/src/lib/api-client";

export async function fetchAllCollections(ctx: IFetchAllCollections) {
  const { userId, page = 1, limit = 12 } = ctx;
  const path = `${COLLECTION_OP.FETCH_ALL_COLLECTIONS}?userId=${userId}&page=${page}&limit=${limit}`;

  return ApiClient.get(path);
}