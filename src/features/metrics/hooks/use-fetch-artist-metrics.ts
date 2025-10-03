import { useTokenStore } from "@/src/features/auth/state/store";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { ArtistError } from "../../profile/artist/error/artist.error";
import { IArtistMetricsDto } from "../../profile/types/profile.types";
import { fetchArtistMetrics } from "../api/artist-metrics/route";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useFetchArtistMetrics = () => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore(selectUserId);

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
    enabled: !!userId && canFetch,
  });
};
