import { ApiClient } from "@/src/lib/api-client";

export type ArtistContentType = "posts" | "collections";

export interface ArtistContentPage {
  status: number;
  data: {
    profile: {
      id: string;
      firstName: string | null;
      lastName: string | null;
      username: string | null;
      imageUrl: string | null;
      description: string | null;
      followerCount: number | null;
    } | null;
    items: Record<string, any>[];
    pagination: {
      currentPage: number;
      totalItems: number;
      totalPages: number;
      hasNextPage: boolean;
    };
  };
}

export const fetchArtistContent = (
  artistId: string,
  type: ArtistContentType,
  page: number,
  limit = 12,
) =>
  ApiClient.get<ArtistContentPage>(
    `/api/asset/artist-content?${new URLSearchParams({ artistId, type, page: String(page), limit: String(limit) })}`,
  );
