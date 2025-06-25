import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { CartError } from "../error/cart.error";
import { removeFromCart } from "../api/remove-from-cart/route";

export const useRemoveFromCart = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore((state) => state.user?.id);

  if (!userId) {
    return {
      mutateAsync: async () => {},
      isPending: false,
      isSuccess: false,
      isError: false,
      error: null,
      data: null,
    };
  }
  return useMutation({
    mutationKey: [`remove-from-cart-${userId}`],
    mutationFn: async (fileId: string) => {
      const result = await ResultAsync.fromPromise(
        removeFromCart({
          userId,
          fileId,
        }),
        (error) => new CartError(`Error removing item to cart ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new CartError(`An error occurred while calling function ${data}`),
          );
        }
      });

      if (result.isErr()) {
        return result.error;
      }

      console.log(result.value);
      return result.value;
    },

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [`fetch-user-cart-${userId}`],
      });
    },
  });
};
