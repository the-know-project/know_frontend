import { useQuery } from "@tanstack/react-query";
import {
  IValidateFollowingResponse,
  IValidateUserFollowing,
} from "../types/metrics.types";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { err, ok, ResultAsync } from "neverthrow";
import { validateUserFollowing } from "../api/validate-follow/route";
import { MetricsError } from "../error/metrics.error";

type FollowUserParams = Omit<IValidateUserFollowing, "followerId">;

export const useValidateFollow = (params: FollowUserParams) => {
  const followerId = useTokenStore(selectUserId);
  return useQuery({
    queryKey: [`validate-follow-${followerId}`],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        validateUserFollowing({
          followerId: followerId!,
          followingId: params.followingId,
        }),
        (error) => new MetricsError(`Error validating follow ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new MetricsError(`Error validating follow ${data.message}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as IValidateFollowingResponse;
    },

    enabled: !!followerId && !!params.followingId,
  });
};
