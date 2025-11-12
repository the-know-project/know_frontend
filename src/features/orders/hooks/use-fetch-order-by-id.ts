import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { fetchOrderById } from "../api/order-by-id/route";
import { OrdersErrorMessages } from "../data/orders.data";
import { OrdersError } from "../errors/orders.error";

export const useFetchOrderById = (orderId: string) => {
  return useQuery({
    queryKey: [`fetch-order-by-id`, orderId],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchOrderById(orderId),
        (error) => new OrdersError(`Orders error: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new OrdersError(OrdersErrorMessages.FAILED_TO_FETCH_ORDER_BY_ID),
          );
        }
      });
      if (result.isErr()) {
        throw result.error;
      }

      return result.value as OrdersByIdResponse;
    },
    staleTime: 5000,
    enabled: !!orderId,
  });
};
