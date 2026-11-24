export interface CollectionAsset {
  fileId: string;
  assetUrl: string;
  artTitle: string;
  artPrice: string | number;
  numOfLikes: number;
  artDescription?: string | null;
  artCategories?: string[] | null;
  artTags?: string[] | null;
  artSize?: {
    width?: number;
    height?: number;
    weight?: number;
    depth?: number;
    diameter?: number;
    length?: number;
    aspectRatio?: string;
    weightUnit?: string;
    dimensionUnit?: string;
  } | null;
  isArtListed?: boolean;
  artistProfileUrl?: string | null;
  artistId?: string | null;
  artCreatedAt?: string | Date | null;
  artViewCount?: number | null;
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
  bannerPositionX: number;
  bannerPositionY: number;
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

export interface ArtistAssetOverview {
  fileId: string;
  name: string;
  url: string;
  highResUrl?: string;
  price?: string | number;
  createdAt: string;
}

export interface ArtistAssetsPage {
  status: number;
  data: {
    items: ArtistAssetOverview[];
    pagination: {
      currentPage: number;
      hasNextPage: boolean;
    };
  };
}
