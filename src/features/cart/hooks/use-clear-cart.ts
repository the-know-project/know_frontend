import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { err, ok, ResultAsync } from "neverthrow";
import { clearCart } from "../api/clear-cart/route";
import { CartError } from "../error/cart.error";
import { useCartActions } from "../state/cart.store";

export const useClearCart = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { clearCartItems } = useCartActions();

  return useMutation({
    mutationKey: ["clear-user-cart", userId],
    mutationFn: async () => {
      const result = await ResultAsync.fromPromise(
        clearCart(),
        (error) => new CartError(`Error clearing user cart: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new CartError("An error occurred while clearing user cart"),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value;
    },

    onSuccess: () => {
      console.log("Successfully cleared cart, emptying local cart");
      clearCartItems();
    },

    onSettled: () => {
      console.log(" Invalidating cart queries");
      queryClient.invalidateQueries({
        queryKey: [`fetch-user-cart-${userId}`],
      });
    },
  });
};
