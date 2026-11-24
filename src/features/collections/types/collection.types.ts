export interface CollectionAsset {
  fileId: string;
  assetUrl: string;
  artTitle: string;
  artPrice: string | number;
  numOfLikes: number;
}

export interface Collection {
  id: string;
  ownerId: string;
  title: string;
  firstName: string;
  lastName: string;
  username?: string;
  description: string;
  price: string;
  currency: string;
  assetPriceTotal: string;
  completedSalesVolume: string;
  numOfArt: number;
  numOfLikes: number;
  createdAt: string;
  bannerUrl?: string;
  imageUrl?: string;
  assetData: CollectionAsset[];
}

export interface CollectionOverview {
  id: string;
  title: string;
  description?: string | null;
  bannerUrl?: string | null;
  imageUrl?: string | null;
  price?: string;
  currency?: string;
  likeCount?: number;
  assetCount?: number;
  createdAt: string;
}

export interface ArtistCollectionsPage {
  status: number;
  data: {
    profile: unknown;
    items: CollectionOverview[];
    pagination: {
      currentPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
    };
  };
}
