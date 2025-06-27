import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { ExploreError } from "../errors/explore.error";
import { fetchUserLikes } from "../api/fetch-user-likes/route";

export const useFetchLikedAssets = () => {
  const userId = useTokenStore((state) => state.user?.id);

  return useQuery({
    queryKey: ["liked-assets", userId],
    queryFn: async () => {
      if (!userId) {
        throw new ExploreError("User not authenticated");
      }

      const result = await ResultAsync.fromPromise(
        fetchUserLikes(userId),
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

export const useLikedAssetsWithCounts = () => {
  const { data, isLoading, error } = useFetchLikedAssets();

  const likedAssetsWithCounts = data?.data || [];

  return {
    likedAssetsWithCounts,
    isLoading,
    error,
  };
};
