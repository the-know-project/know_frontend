import { useMutation } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { IIncrementViewCount } from "../types/metrics.types";
import { err, ok, ResultAsync } from "neverthrow";
import { incrementViewCount } from "../api/route";
import { MetricsError } from "../error/metrics.error";

export const useIncrementPostViews = () => {
  const userId = useTokenStore((state) => state.user?.id);
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

      return result.value;
    },
  });
};
