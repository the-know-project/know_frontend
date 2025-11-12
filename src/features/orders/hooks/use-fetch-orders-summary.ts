import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchOrdersSummary } from "../api/orders-summary/route";
import { OrdersErrorMessages } from "../data/orders.data";
import { OrdersError } from "../errors/orders.error";
import { useTokenStore } from "../../auth/state/store";
import {
  selectIsAuthenticated,
  selectUserId,
} from "../../auth/state/selectors/token.selectors";
import { OrderSummaryResponse } from "../types/orders.types";

export const useFetchOrdersSummary = () => {
  const userId = useTokenStore(selectUserId);
  const isAuthenticated = useTokenStore(selectIsAuthenticated);

  return useQuery({
    queryKey: [`fetch-orders-summary`, userId],
    queryFn: async () => {
      if (!userId) {
        throw new OrdersError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        fetchOrdersSummary(userId),
        (error) => new OrdersError(`Orders error: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new OrdersError(OrdersErrorMessages.FAILED_TO_FETCH_ORDERS_SUMMARY),
          );
        }
      });
      if (result.isErr()) {
        throw result.error;
      }

      return result.value as OrderSummaryResponse;
    },
    staleTime: 5000,
    enabled: isAuthenticated && !!userId,
  });
};
