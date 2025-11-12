import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { unfollowUser } from "../api/unfollow-user/route";
import { MetricsError } from "../error/metrics.error";
import { IUnFollowUser } from "../types/metrics.types";

type UnfollowUserParams = Omit<IUnFollowUser, "followerId">;

export const useUnfollowUser = () => {
  const queryClient = useQueryClient();
  const followerId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`unfollow-user`, followerId],
    mutationFn: async (params: UnfollowUserParams) => {
      if (!followerId) {
        throw new MetricsError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        unfollowUser({ ...params, followerId }),
        (error) => new MetricsError(`Error unfollowing user: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new MetricsError("Failed to unfollow user"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [`user-followers`, variables.followingId] });
      queryClient.invalidateQueries({ queryKey: [`user-following`, followerId] });
      queryClient.invalidateQueries({ queryKey: [`artist-${variables.followingId}-metrics`] });
      queryClient.invalidateQueries({ queryKey: [`artist-${followerId}-metrics`] });
    },
  });
};
