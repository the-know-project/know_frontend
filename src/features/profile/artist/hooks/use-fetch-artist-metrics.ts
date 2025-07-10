import { useTokenStore } from "@/src/features/auth/state/store";
import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchArtistMetrics } from "../api/metrics/route";
import { ArtistError } from "../error/artist.error";
import { IArtistMetricsDto } from "../../types/profile.types";

export const useFetchArtistMetrics = () => {
  const userId = useTokenStore((state) => state.user?.id);
  if (!userId) {
    return {
      data: null,
      isLoading: false,
      isError: false,
      error: null,
      refetch: () => Promise.resolve(),
    };
  }
  return useQuery({
    queryKey: [`artist-${userId}-metrics`],
    queryFn: async () => {
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
  });
};
