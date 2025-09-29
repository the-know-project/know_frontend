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
}
