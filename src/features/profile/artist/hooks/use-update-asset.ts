import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { updateAsset } from "../api/update-asset/route";
import type { IUpdateAssetRequest } from "../api/update-asset/route";

export const useUpdateAsset = () => {
  const userId = useTokenStore(selectUserId);
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [`update-asset-${userId}`],
    mutationFn: (data: IUpdateAssetRequest) => updateAsset(data),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: [`user-${userId}-posts`] }),
        queryClient.invalidateQueries({ queryKey: ["fetch-explore-asset"] }),
      ]);
    },
  });
};
