import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserCart } from "../api/fetch-user-cart/route";
import { CartError } from "../error/cart.error";

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

      return result.value;
    },
    staleTime: 5000,
  });
};
