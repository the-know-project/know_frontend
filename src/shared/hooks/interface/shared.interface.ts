export interface IExploreContent {
  id: string;
  userId: string;
  creatorProfileUrl: string;
  creatorName: string;
  artName: string;
  description: string | null;
  artWorkUrl: string;
  categories: string[];
  tags: string[] | undefined;
  price: number;
  size: {
    width: number;
    height: number;
  };
  numOfLikes: number;
  numOfViews: number;
  numOfComments: number;
  isListed: boolean;
  createdAt: Date;
}
