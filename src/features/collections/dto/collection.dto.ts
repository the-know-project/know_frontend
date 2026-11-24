export interface CreateCollectionInput {
  title: string;
  description: string;
  price: string;
  currency: string;
  tags?: string[];
  bannerImage?: File | null;
  profileImage?: File | null;
  bannerPositionX?: number;
  bannerPositionY?: number;
}

export interface UpdateCollectionInput {
  collectionId: string;
  title: string;
  description: string;
  tags?: string[];
  bannerImage?: File | null;
  profileImage?: File | null;
  bannerPositionX?: number;
  bannerPositionY?: number;
}

export interface CollectionAssetInput {
  collectionId: string;
  fileId: string;
}

export interface CollectionMetricInput {
  collectionId: string;
}

export interface CollectionViewResponse {
  status: number;
  data?: { counted: boolean };
}

export interface ToggleCollectionLikeInput extends CollectionMetricInput {
  isLiked: boolean;
}

export interface DeleteCollectionInput {
  collectionId: string;
}

export interface CreateCollectionResponse {
  status: number;
  data?: { id?: string };
}

export interface FetchCollectionResponse {
  status: number;
  data: import("../types/collection.types").Collection;
}
