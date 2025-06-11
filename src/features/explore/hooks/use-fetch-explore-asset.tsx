import { useQuery } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";

export const useFetchExploreAsset = () => {
  const id = useTokenStore((state) => state.user?.id);
  return useQuery({
    queryKey: [`fetch-explore-${id}-asset`],
    queryFn: async () => {},
  });
};
