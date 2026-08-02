import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { useTokenStore } from "@/src/features/auth/state/store";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { UnlistAsset } from "../api/unlist-asset/route";

export const useUnlistAsset = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`unlist-asset-${userId}`],
    mutationFn: async (fileId: string) => {
      const result = await ResultAsync.fromPromise(
        UnlistAsset(fileId),
        (error) => new Error(`Error unlisting asset ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(new Error(`Error unlisting asset ${data.status}`));
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`user-${userId}-posts`],
      });
    },
  });
};
