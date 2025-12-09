import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { addToCart } from "../api/add-to-cart/route";
import { CartError } from "../error/cart.error";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { IUserCart, TCart } from "../types/cart.types";
import { useCartActions } from "../state/cart.store"; // Import cart store actions

export const useAddToCart = ({ enabled }: { enabled: boolean }) => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { addToCart: addToLocalCart, removeFromCart: removeFromLocalCart } =
    useCartActions();

  return useMutation({
    mutationKey: ["add-to-cart", userId],
    mutationFn: async (fileId: string) => {
      if (!enabled || !userId) {
        throw new CartError("Cannot add to cart: User not authenticated");
      }

      const result = await ResultAsync.fromPromise(
        addToCart({
          userId,
          fileId,
        }),
        (error) => new CartError(`Error adding item to cart: ${error}`),
      ).andThen((data) => {
        if (data.status === 200 || data.status === 201) {
          return ok(data);
        } else {
          return err(
            new CartError(
              `An error occurred while calling function: ${JSON.stringify(data)}`,
            ),
          );
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      console.log(" Item added to cart:", result.value);
      return result.value;
    },

    onMutate: async (fileId: string) => {
      addToLocalCart(fileId);

      await queryClient.cancelQueries({
        queryKey: ["fetch-user-cart", userId],
      });

      const previousCart = queryClient.getQueryData<IUserCart>([
        "fetch-user-cart",
        userId,
      ]);

      if (previousCart) {
        queryClient.setQueryData<IUserCart>(
          ["fetch-user-cart", userId],
          (old) => {
            if (!old) return old;
            const oldData = old?.data?.find((data) => data.fileId === fileId);

            const newItem: TCart = {
              id: oldData?.id || "",
              price: oldData?.price || 0,
              quantity: oldData?.quantity || 1,
              url: oldData?.url || "",
              fileId,
              artistFirstName: oldData?.artistFirstName || "",
              artistLastName: oldData?.artistLastName || "",
              title: oldData?.title || "",
              viewCount: oldData?.viewCount || 0,
              userId: userId!,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            };

            return {
              ...old,
              data: [...(old.data ?? []), newItem],
            };
          },
        );
      }

      return { previousCart };
    },

    onError: (error, fileId, context) => {
      console.error(" Failed to add to cart:", error);

      removeFromLocalCart(fileId);

      if (context?.previousCart) {
        queryClient.setQueryData(
          ["fetch-user-cart", userId],
          context.previousCart,
        );
      }
    },

    onSuccess: (data, fileId) => {
      console.log(" Successfully added to cart, syncing stores");
      addToLocalCart(fileId);
    },

    onSettled: () => {
      console.log(" Invalidating cart queries");
      queryClient.invalidateQueries({
        queryKey: ["fetch-user-cart", userId],
      });
    },
  });
};
