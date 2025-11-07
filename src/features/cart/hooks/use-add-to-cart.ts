import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { addToCart } from "../api/add-to-cart/route";
import { CartError } from "../error/cart.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";

export const useAddToCart = ({ enabled}: { enabled: boolean}) => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  // if (!userId) {
  //   return {
  //     mutateAsync: async () => {},
  //     isPending: false,
  //     isSuccess: false,
  //     isError: false,
  //     error: null,
  //     data: null,
  //   };
  // }

  return useMutation({
    mutationKey: [`add-to-cart-${userId}`],
    mutationFn: async (fileId: string) => {
      if(!enabled || !userId) {
        throw new CartError('Cannot add to cart: User not authenticated');
      };
      const result = await ResultAsync.fromPromise(
        addToCart({
          userId,
          fileId,
        }),
        (error) => new CartError(`Error adding item to cart ${error}`),
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
