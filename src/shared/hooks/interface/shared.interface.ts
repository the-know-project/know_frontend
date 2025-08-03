export interface IExploreContent {
  id: string;
  creatorProfileUrl: string;
  creatorName: string;
  artName: string;
  description: string | null;
  artWorkUrl: string;
  categories: string[];
  tags: string[] | undefined;
}
