import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { fetchShippingInfo } from "../api/fetch-shipping-info/route";

export const useFetchShippingInfo = () => {
  const userId = useTokenStore(selectUserId);
  return useQuery({
    queryKey: [`fetch-shipping-info-${userId}`],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchShippingInfo(),
        (error) =>
          new Error(`An error occurred while fetching shipping info ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        }

        return err(new Error(`${data.message}`));
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as ICreateShippingResponse;
    },
  });
};
