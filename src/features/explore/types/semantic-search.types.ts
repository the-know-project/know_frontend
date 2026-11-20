export interface SemanticSearchAsset {
  fileId: string;
  fileName: string;
  description: string | null;
  url: string;
  highResUrl?: string;
  extraUrls?: string[];
  highResExtraUrls?: string[];
  userId?: string;
  firstName?: string | null;
  lastName?: string | null;
  imageUrl?: string | null;
  price: number | string | null;
  currency?: string;
  quantity?: number;
  categories?: string[];
  tags?: string[];
  size?: Record<string, number | string>;
  isListed?: boolean;
  isLocked?: boolean;
  numOfLikes?: number;
  numOfViews?: number;
  createdAt?: string;
  visualDescription?: string;
  similarity?: number;
}

export interface SemanticSearchResponse {
  status: number;
  data: {
    assets: SemanticSearchAsset[];
    pagination: { currentPage: number; itemsPerPage: number };
  };
}

export interface SemanticSearchFilters {
  categories?: string[];
  priceMin?: number;
  priceMax?: number;
  available?: boolean;
}
