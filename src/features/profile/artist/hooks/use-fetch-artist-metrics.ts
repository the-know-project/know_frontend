import { useTokenStore } from "@/src/features/auth/state/store";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchArtistMetrics } from "../api/metrics/route";
import { ArtistError } from "../error/artist.error";
import { IArtistMetricsDto } from "../../types/profile.types";
import { useCanFetchData } from "@/src/hooks/useStableAuth";

export const useFetchArtistMetrics = () => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore((state) => state.user?.id);
  const isAuthenticated = useTokenStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: [`artist-${userId}-metrics`],
    queryFn: async () => {
      if (!userId) {
        throw new ArtistError("User ID is required to fetch artist metrics");
      }

      const result = await ResultAsync.fromPromise(
        fetchArtistMetrics(userId),
        (error) => new ArtistError(`Error fetching artist metrics ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(`An error occurred while fetching artist metrics`);
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      console.log(result.value);

      return result.value as IArtistMetricsDto;
    },
    enabled: !!userId && isAuthenticated && canFetch,
  });
};
