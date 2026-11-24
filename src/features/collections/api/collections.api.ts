import { ApiClient } from "@/src/lib/api-client";
import type {
  CollectionAssetInput,
  CreateCollectionInput,
  CreateCollectionResponse,
  FetchCollectionResponse,
  UpdateCollectionInput,
} from "../dto/collection.dto";
import type { ArtistCollectionsPage } from "../types/collection.types";
import { COLLECTIONS_ROUTES } from "../routes/collections.routes";

export const fetchArtistCollections = (
  artistId: string,
  page: number,
  limit = 12,
) =>
  ApiClient.get<ArtistCollectionsPage>(
    `/api/asset/artist-content?${new URLSearchParams({ artistId, type: "collections", page: String(page), limit: String(limit) })}`,
  );

export const fetchCollection = (collectionId: string) =>
  ApiClient.get<FetchCollectionResponse>(
    `${COLLECTIONS_ROUTES.FETCH_COLLECTIONS}?collectionId=${encodeURIComponent(collectionId)}`,
  );

export const createCollection = (input: CreateCollectionInput) => {
  const body = new FormData();
  body.append("title", input.title);
  body.append("description", input.description || " ");
  body.append("price", input.price);
  body.append("currency", input.currency);
  if (input.bannerImage) body.append("bannerImage", input.bannerImage);
  if (input.profileImage) body.append("profileImage", input.profileImage);
  return ApiClient.post<CreateCollectionResponse>(
    COLLECTIONS_ROUTES.CREATE_COLLECTION,
    body,
  );
};

export const updateCollection = (input: UpdateCollectionInput) => {
  const body = new FormData();
  body.append("collectionId", input.collectionId);
  body.append("title", input.title);
  body.append("description", input.description);
  if (input.bannerImage) body.append("bannerImage", input.bannerImage);
  if (input.profileImage) body.append("profileImage", input.profileImage);
  return ApiClient.patch(COLLECTIONS_ROUTES.UPDATE_COLLECTION, body);
};

export const addAssetToCollection = (input: CollectionAssetInput) =>
  ApiClient.post("/api/collections/addToCollection", input);

export const removeAssetFromCollection = (input: CollectionAssetInput) =>
  ApiClient.delete("/api/collections/removeFromCollection", input);
