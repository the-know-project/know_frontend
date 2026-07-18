import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "../../auth/state/store";
import { err, ok, ResultAsync } from "neverthrow";
import { CartError } from "../error/cart.error";
import { removeFromCart } from "../api/remove-from-cart/route";
import { selectUser } from "../../auth/state/selectors/token.selectors";
import { IUserCart } from "../types/cart.types";
import { useCartActions } from "../state/cart.store";

export type RemoveFromCartResult = {
  mutate: (fileId: string) => void;
  mutateAsync: (fileId: string) => Promise<any | null>;
  isPending: boolean;
  isError: boolean;
  error: Error | null;
  status: "idle" | "pending" | "success" | "error";
};

export const useRemoveFromCart = ({
  enabled,
}: {
  enabled: boolean;
}): RemoveFromCartResult => {
  const queryClient = useQueryClient();
  const user = useTokenStore(selectUser);
  const { addToCart: addToLocalCart, removeFromCart: removeFromLocalCart } =
    useCartActions();

  const { mutate, mutateAsync, isPending, isError, error, status } =
    useMutation({
      mutationKey: ["remove-from-cart", user?.id],

      mutationFn: async (fileId: string) => {
        if (!enabled || !user?.id) {
          throw new CartError("Cannot remove from cart: Operation not allowed");
        }

        const result = await ResultAsync.fromPromise(
          removeFromCart({
            userId: user.id,
            fileId,
          }),
          (error) => new CartError(`Failed to remove item from cart: ${error}`),
        ).andThen((data) => {
          if (data.status === 200) {
            return ok(data);
          } else {
            return err(new CartError(`Error removing item: ${data.message}`));
          }
        });

        if (result.isErr()) {
          throw result.error;
        }
      },

      onMutate: async (fileId: string) => {
        if (!user?.id) return;

        removeFromLocalCart(fileId);

        await queryClient.cancelQueries({
          queryKey: [`fetch-user-cart-${user.id}`],
        });

        const previousCart = queryClient.getQueryData<IUserCart>([
          `fetch-user-cart-${user.id}`,
        ]);

        if (previousCart) {
          queryClient.setQueryData<IUserCart>(
            [`fetch-user-cart-${user.id}`],
            (old) => {
              if (!old) return old;

              return {
                ...old,
                data: (old.data ?? []).filter((item) => item.fileId !== fileId),
              };
            },
          );
        }

        return { previousCart };
      },

      onError: (error, fileId, context) => {
        console.error(" Failed to remove from cart:", error);

        addToLocalCart(fileId);

        if (context?.previousCart && user?.id) {
          console.log(" Rolling back optimistic update");
          queryClient.setQueryData(
            [`fetch-user-cart-${user.id}`],
            context.previousCart,
          );
        }
      },

      onSuccess: (data, fileId) => {
        console.log(" Successfully removed from cart");

        if (user?.id) {
          removeFromLocalCart(fileId);

          queryClient.invalidateQueries({
            queryKey: [`fetch-user-cart-${user.id}`],
          });

          queryClient.invalidateQueries({
            queryKey: ["cart", user.id],
          });
        }
      },

      onSettled: () => {
        if (user?.id) {
          console.log(" Invalidating cart queries");
          queryClient.invalidateQueries({
            queryKey: [`fetch-user-cart-${user.id}`],
          });
        }
      },
    });

  return {
    mutate,
    mutateAsync: async (fileId: string) => {
      if (!enabled || !user?.id) {
        console.warn(
          " Cannot remove from cart: Not enabled or user not authenticated",
        );
        return null;
      }
      return mutateAsync(fileId);
    },
    isPending,
    isError,
    error,
    status,
  };
};
