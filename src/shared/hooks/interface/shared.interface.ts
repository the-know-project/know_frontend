export interface IExploreContent {
  id: string;
  userId: string;
  creatorProfileUrl: string;
  creatorName: string;
  artName: string;
  description: string | null;
  artWorkUrl: string;
  highResUrl: string;
  extraUrls: string[] | undefined;
  highResExtraUrls: string[] | undefined;
  categories: string[];
  tags: string[] | undefined;
  price: number;
  quantity?: number;
  size: {
    width?: number;
    height?: number;
    weight?: number;
    depth?: number;
    diameter?: number;
    length?: number;
    aspectRatio?: string;
    weightUnit?: string;
    dimensionUnit?: string;
  };
  numOfLikes: number;
  numOfViews: number;
  numOfComments: number;
  isListed: boolean;
  createdAt: Date;
}
