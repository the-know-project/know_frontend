import { ApiClient } from "@/src/lib/api-client";
import { COLLECTION_OP } from "../../data/collection.route";
import { IFetchCollection } from "../../types/collections.type";

export async function fetchCollection(ctx: IFetchCollection) {
  const path = `${COLLECTION_OP.FETCH_COLLECTION}?userId=${ctx.userId}&collectionId=${ctx.collectionId}`;

  return ApiClient.get(path);
}
