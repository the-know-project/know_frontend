import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { ArtistError } from "../../profile/artist/error/artist.error";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchArtistSalesMetrics } from "../api/artist-sales-metrics/route";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";

export const useFetchArtistSalesMetrics = () => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore((state) => state.user?.id);
  return useQuery({
    queryKey: [`artist-${userId}-sales-data`],
    queryFn: async () => {
      if (!userId) {
        throw new ArtistError("User ID is required");
      }

      const result = await ResultAsync.fromPromise(
        fetchArtistSalesMetrics({
          userId,
        }),
        (error) =>
          new ArtistError(`Error fetch artist sales metrics: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err("An error occurred while fetching artist sales metrics");
        }
      });

      if (result.isErr()) {
        throw new ArtistError(
          `An error occurred while fetching sales metrics ${result.error}`,
        );
      }

      return result.value;
    },
    enabled: !!userId && canFetch,
  });
};
