export interface CreateCollectionInput {
  title: string;
  description: string;
  price: string;
  currency: string;
  bannerImage?: File | null;
  profileImage?: File | null;
}

export interface UpdateCollectionInput {
  collectionId: string;
  title: string;
  description: string;
  bannerImage?: File | null;
  profileImage?: File | null;
}

export interface CollectionAssetInput {
  collectionId: string;
  fileId: string;
}

export interface CreateCollectionResponse {
  status: number;
  data?: { id?: string };
}

export interface FetchCollectionResponse {
  status: number;
  data: import("../types/collection.types").Collection;
}
