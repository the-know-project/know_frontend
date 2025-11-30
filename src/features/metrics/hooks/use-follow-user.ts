import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { followUser } from "../api/follow-user/route";
import { MetricsError } from "../error/metrics.error";
import { IFollowUser } from "../types/metrics.types";

type FollowUserParams = Omit<IFollowUser, "followerId">;

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const followerId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`follow-user`, followerId],
    mutationFn: async (params: FollowUserParams) => {
      if (!followerId) {
        throw new MetricsError("User not authenticated");
      }

      if (followerId === params.followingId) {
        throw new MetricsError("Cannot follow yourself");
      }

      const result = await ResultAsync.fromPromise(
        followUser({ ...params, followerId }),
        (error) => new MetricsError(`Error following user: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new MetricsError("Failed to follow user"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`user-followers`, variables.followingId],
      });
      queryClient.invalidateQueries({
        queryKey: [`user-following`, followerId],
      });
      queryClient.invalidateQueries({
        queryKey: [`artist-${variables.followingId}-metrics`],
      });
      queryClient.invalidateQueries({
        queryKey: [`artist-${followerId}-metrics`],
      });
    },
  });
};
