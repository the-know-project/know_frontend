import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { IIncrementViewCount } from "../types/metrics.types";
import { err, ok, ResultAsync } from "neverthrow";
import { incrementViewCount } from "../api/route";
import { MetricsError } from "../error/metrics.error";
import { showLog } from "@/src/utils/logger";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useIncrementPostViews = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  return useMutation({
    mutationKey: [`increment-post-view-${userId}`],
    mutationFn: async (ctx: Omit<IIncrementViewCount, "userId">) => {
      const result = await ResultAsync.fromPromise(
        incrementViewCount({
          userId: userId as string,
          fileId: ctx.fileId,
        }),
        (error) => new MetricsError(`Error incrementing view count ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new MetricsError(`Error incrementing view count ${data.status}`),
          );
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      showLog({
        context: "useIncrementViewCount",
        data: result.value,
      });

      return result.value;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [
          `user-${userId}-posts`,
          {
            userId,
            page: 1,
            limit: 12,
          },
          `fetch-explore-asset`,
          `artist-${userId}-metrics`,
        ],
      });
    },
  });
};
