import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { fetchUserFollowers } from "../api/user-followers/routes";
import { MetricsError } from "../error/metrics.error";
import { IFetchUserFollowers } from "../types/metrics.types";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";

type FetchUserFollowersParams = Omit<IFetchUserFollowers, "userId">;

export const useFetchUserFollowers = (params: FetchUserFollowersParams) => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore(selectUserId);
  const { page, limit } = params;

  return useQuery({
    queryKey: [`user-followers`, { userId, page, limit }],
    queryFn: async () => {
      if (!userId) {
        throw new MetricsError("User ID is required to fetch followers");
      }
      const result = await ResultAsync.fromPromise(
        fetchUserFollowers({ userId, page, limit }),
        (error) => new MetricsError(`Error fetching user followers: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new MetricsError("Failed to fetch user followers"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    enabled: !!userId && canFetch,
  });
};
