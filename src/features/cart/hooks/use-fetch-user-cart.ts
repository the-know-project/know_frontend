import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserCart } from "../api/fetch-user-cart/route";
import { CartError } from "../error/cart.error";
import { useBulkCartActions } from "./use-cart";

export const useFetchUserCart = () => {
  const userId = useTokenStore((state) => state.user?.id);
  if (!userId) {
    return {
      data: [],
      isLoading: false,
      isError: false,
      error: null,
    };
  }
  const { initCart } = useBulkCartActions();

  return useQuery({
    queryKey: [`fetch-user-cart-${userId}`],
    queryFn: async () => {
      const result = await ResultAsync.fromPromise(
        fetchUserCart(userId),
        (error) => new CartError(`Error fetching user cart ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        } else {
          return err(
            new CartError(`Error fetching user cart: ${data.message}`),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      initCart(result.value.data);
      return result.value;
    },
    staleTime: 5000,
  });
};
