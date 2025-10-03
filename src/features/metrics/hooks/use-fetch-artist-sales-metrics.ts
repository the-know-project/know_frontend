import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { ArtistError } from "../../profile/artist/error/artist.error";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchArtistSalesMetrics } from "../api/artist-sales-metrics/route";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";
import {
  IArtistMonthlySalesDataResponse,
  IArtistYearlySalesDataResponse,
  ISalesDuration,
} from "../types/metrics.types";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useFetchArtistSalesMetrics = (duration?: ISalesDuration) => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore(selectUserId);
  return useQuery({
    queryKey: [`artist-${userId}-sales-data`],
    queryFn: async () => {
      if (!userId) {
        throw new ArtistError("User ID is required");
      }

      const result = await ResultAsync.fromPromise(
        fetchArtistSalesMetrics({
          userId,
          duration,
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

      if (!duration) {
        return result.value as IArtistMonthlySalesDataResponse;
      } else if (duration === "YEARLY") {
        return result.value as IArtistYearlySalesDataResponse;
      } else {
        return result.value as IArtistMonthlySalesDataResponse;
      }
    },
    enabled: !!userId && canFetch,
  });
};
