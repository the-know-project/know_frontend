import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useFetchShippingInfo = () => {
  const userId = useTokenStore(selectUserId);
  return useQuery({
    queryKey: [`fetch-shipping-info-${userId}`],
    queryFn: async () => {},
  });
};
