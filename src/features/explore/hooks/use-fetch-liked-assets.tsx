import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { ExploreError } from "../errors/explore.error";

// Define the API response type for liked assets
interface LikedAsset {
  fileId: string;
  userId: string;
  likedAt: string;
}

interface FetchLikedAssetsResponse {
  status: number;
  data: {
    likedAssets: LikedAsset[];
  };
}

const fetchLikedAssets = async (
  userId: string,
): Promise<FetchLikedAssetsResponse> => {
  const response = await fetch(`/api/users/${userId}/liked-assets`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch liked assets: ${response.statusText}`);
  }

  return response.json();
};

export const useFetchLikedAssets = () => {
  const userId = useTokenStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["liked-assets", userId],
    queryFn: async () => {
      if (!userId) {
        throw new ExploreError("User not authenticated");
      }

      const result = await ResultAsync.fromPromise(
        fetchLikedAssets(userId),
        (error) => new ExploreError(`Error fetching liked assets: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new ExploreError(`Failed to fetch liked assets: ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    enabled: !!userId,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes
  });
};

// Helper hook to get just the liked asset IDs
export const useLikedAssetIds = () => {
  const { data, isLoading, error } = useFetchLikedAssets();

  const likedAssetIds =
    data?.data.likedAssets.map((asset) => asset.fileId) || [];

  return {
    likedAssetIds,
    isLoading,
    error,
  };
};
