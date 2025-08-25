import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useCanFetchData } from "@/src/hooks/useStableAuth";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserCart } from "../api/fetch-user-cart/route";
import { CartError } from "../error/cart.error";
import { IUserCart } from "../types/cart.types";

export const useFetchUserCart = () => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore((state) => state.user?.id);

  return useQuery({
    queryKey: [`fetch-user-cart-${userId}`],
    queryFn: async () => {
      if (!userId) {
        throw new CartError("User ID is required to fetch cart");
      }

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

      return result.value as IUserCart;
    },
    staleTime: 5000,
    enabled: canFetch && !!userId,
  });
};
