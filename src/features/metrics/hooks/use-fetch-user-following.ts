import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { fetchUserFollowing } from "../api/user-following/route";
import { MetricsError } from "../error/metrics.error";
import { IFetchUserFollowing } from "../types/metrics.types";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";

type FetchUserFollowingParams = Omit<IFetchUserFollowing, "userId">;

export const useFetchUserFollowing = (params: FetchUserFollowingParams) => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore(selectUserId);
  const { page, limit } = params;

  return useQuery({
    queryKey: [`user-following`, { userId, page, limit }],
    queryFn: async () => {
      if (!userId) {
        throw new MetricsError("User ID is required to fetch following list");
      }
      const result = await ResultAsync.fromPromise(
        fetchUserFollowing({ userId, page, limit }),
        (error) =>
          new MetricsError(`Error fetching user following list: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new MetricsError("Failed to fetch user following list"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as IFetchUserFollowing;
    },
    enabled: !!userId && canFetch,
  });
};
