import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { followUser } from "../api/follow-user/route";
import { MetricsError } from "../error/metrics.error";
import {
  IFetchUserFollowingResponse,
  IFollowUser,
  IFollowUserResponseDto,
} from "../types/metrics.types";
import { useFollowActions } from "../state/store/metrics.store";

type FollowUserParams = Omit<IFollowUser, "followerId">;

export const useFollowUser = () => {
  const queryClient = useQueryClient();
  const followerId = useTokenStore(selectUserId);
  const { followUser: _followUser, unfollowUser: _unfollowUser } =
    useFollowActions();

  return useMutation({
    mutationKey: [`follow-user`, followerId],
    mutationFn: async (params: FollowUserParams) => {
      if (!followerId) {
        throw new MetricsError("User not authenticated");
      }

      if (followerId === params.followingId) {
        return;
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

      return result.value as IFollowUserResponseDto;
    },

    onMutate: async (params) => {
      if (!followerId) return;
      _followUser(followerId, params.followingId);
      await queryClient.cancelQueries({
        queryKey: [`user-followers`, followerId],
      });
      await queryClient.cancelQueries({
        queryKey: [`user-following`, followerId],
      });
      await queryClient.cancelQueries({
        queryKey: [`artist-${followerId}-metrics`],
      });
      await queryClient.cancelQueries({
        queryKey: [`artist-${followerId}-metrics`],
      });

      await queryClient.cancelQueries({
        queryKey: [`validate-follow-${followerId}`],
      });

      const previousData =
        queryClient.getQueryData<IFetchUserFollowingResponse>([
          `user-following`,
          params.followingId,
        ]);

      if (previousData) {
        queryClient.setQueryData<IFetchUserFollowingResponse>(
          [`user-following`, params.followingId],
          (old) => {
            if (!old) return old;
            const oldData = old.data.find((data) => data.id === followerId);

            const newData = {
              id: oldData?.id || followerId || "",
              firstName: oldData?.firstName || "",
              lastName: oldData?.lastName || "",
              role: oldData?.role || "",
              username: oldData?.username || "",
              imageUrl: oldData?.imageUrl || "",
            };

            return {
              ...old,
              data: [...(old.data ?? []), newData],
            };
          },
        );
      }

      return { previousData };
    },

    onError: (error, variables, context) => {
      if (!followerId) return;
      _unfollowUser(followerId, variables.followingId);
      if (context?.previousData) {
        queryClient.setQueryData<IFetchUserFollowingResponse>(
          [`user-following`, followerId],
          context?.previousData,
        );
      }
    },

    onSuccess: (data, _params) => {
      if (!followerId) return;
      _followUser(followerId, _params.followingId);
    },

    onSettled: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: [`user-followers`, followerId],
      });
      queryClient.invalidateQueries({
        queryKey: [`user-following`, followerId],
      });

      queryClient.invalidateQueries({
        queryKey: [`artist-${followerId}-metrics`],
      });

      queryClient.invalidateQueries({
        queryKey: [`validate-follow-${followerId}`],
      });
    },
  });
};
