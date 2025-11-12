import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { createOrder } from "../api/create-order/route";
import { OrdersErrorMessages } from "../data/orders.data";
import { OrdersError } from "../errors/orders.error";
import { ICreateOrder } from "../types/orders.types";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

type CreateOrderParams = Omit<ICreateOrder, "userId">;

export const useCreateOrder = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: [`create-order`, userId],
    mutationFn: async (params: CreateOrderParams) => {
      if (!userId) {
        throw new OrdersError("User not authenticated");
      }
      const result = await ResultAsync.fromPromise(
        createOrder({ ...params, userId }),
        (error) => new OrdersError(`Error creating order: ${error}`),
      ).andThen((data) => {
        if (data.status === 201 || data.status === 200) {
          return ok(data);
        } else {
          return err(
            new OrdersError(OrdersErrorMessages.FAILED_TO_CREATE_ORDER),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-user-orders"] });
      queryClient.invalidateQueries({
        queryKey: ["fetch-orders-summary", userId],
      });
    },
  });
};
