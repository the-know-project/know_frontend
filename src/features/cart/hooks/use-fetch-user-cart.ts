import { useQuery } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { fetchUserCart } from "../api/fetch-user-cart/route";
import { CartError } from "../error/cart.error";
import { IUserCart, TCart } from "../types/cart.types";
import { useCanFetchData } from "../../auth/hooks/use-optimized-auth";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { useAddToCart } from "./use-add-to-cart";
import { useCartActions } from "../state/cart.store";

export const useFetchUserCart = () => {
  const canFetch = useCanFetchData();
  const userId = useTokenStore(selectUserId);
  const { addToCart, getCartItems } = useCartActions();

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

      const userCart = result.value as IUserCart;
      const fetchedItems = userCart.data || [];

      fetchedItems.forEach((fetchedItem) => {
        const localItem = getCartItems().find(
          (item) => item.fileId === fetchedItem.fileId,
        );

        if (!localItem) {
          addToCart({
            fileId: fetchedItem.fileId,
            quantity: fetchedItem.quantity,
            price: fetchedItem.price,
            url: fetchedItem.url,
          });
        } else if (localItem.quantity !== fetchedItem.quantity) {
          addToCart({
            fileId: fetchedItem.fileId,
            quantity: fetchedItem.quantity,
            price: fetchedItem.price,
            url: fetchedItem.url,
          });
        }
      });

      return userCart;
    },

    staleTime: 5000,
    enabled: canFetch && !!userId,
  });
};
