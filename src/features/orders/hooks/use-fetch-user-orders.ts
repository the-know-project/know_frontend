import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchUserOrders } from "../api/all-orders/route";
import { OrdersErrorMessages } from "../data/orders.data";
import { OrdersError } from "../errors/orders.error";
import { IFetchUserOrders, UserOrdersResponse } from "../types/orders.types";
import { useTokenStore } from "../../auth/state/store";
import {
  selectIsAuthenticated,
  selectUserId,
} from "../../auth/state/selectors/token.selectors";

type UseFetchUserOrdersParams = Omit<IFetchUserOrders, "userId">;

export const useFetchUserOrders = (params: UseFetchUserOrdersParams) => {
  const userId = useTokenStore(selectUserId);
  const isAuthenticated = useTokenStore(selectIsAuthenticated);

  return useQuery({
    queryKey: [`fetch-user-orders`, { ...params, userId }],
    queryFn: async () => {
      if (!userId) {
        throw new OrdersError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        fetchUserOrders({ ...params, userId }),
        (error) => new OrdersError(`Orders error: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new OrdersError(OrdersErrorMessages.FAILED_TO_FETCH_USER_ORDERS),
          );
        }
      });
      if (result.isErr()) {
        throw result.error;
      }

      return result.value as UserOrdersResponse;
    },
    staleTime: 5000,
    enabled: isAuthenticated && !!userId,
  });
};
