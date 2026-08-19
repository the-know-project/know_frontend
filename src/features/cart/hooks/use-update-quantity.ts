import { useMutation, useQueryClient } from "@tanstack/react-query";
import { err, ok, ResultAsync } from "neverthrow";
import { useTokenStore } from "../../auth/state/store";
import { selectUserId } from "../../auth/state/selectors/token.selectors";
import { updateItemQuantity } from "../api/update-item-quantity/route";
import { CartError } from "../error/cart.error";
import { useCartActions } from "../state/cart.store";
import {
  IBaseResponse,
  IUpdateCartItemQuantity,
  IUserCart,
} from "../types/cart.types";

export const useUpdateQuantity = ({ enabled }: { enabled: boolean }) => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);
  const { getCartItems, addToCart, incrementQuantity, decrementQuantity } =
    useCartActions();

  return useMutation({
    mutationKey: ["update-cart-item-quantity", userId],

    mutationFn: async (ctx: IUpdateCartItemQuantity) => {
      if (!enabled || !userId) {
        throw new CartError(
          "Cannot update cart item quantity: User not authenticated",
        );
      }

      const result = await ResultAsync.fromPromise(
        updateItemQuantity({
          fileId: ctx.fileId,
          opts: ctx.opts,
        }),
        (error) => new CartError(`Error updating cart item quantity: ${error}`),
      ).andThen((data) => {
        if (data.status === 200) {
          return ok(data);
        }

        return err(
          new CartError(
            `An error occurred while updating item quantity: ${data.message}`,
          ),
        );
      });

      if (result.isErr()) {
        throw result.error;
      }

      return result.value as IBaseResponse;
    },

    onMutate: async (ctx: IUpdateCartItemQuantity) => {
      if (!userId) return;

      const queryKey = [`fetch-user-cart-${userId}`];
      await queryClient.cancelQueries({ queryKey });

      const previousCart = queryClient.getQueryData<IUserCart>(queryKey);
      const previousLocalItem = getCartItems().find(
        (item) => item.fileId === ctx.fileId,
      );

      if (ctx.opts === "add") {
        incrementQuantity(ctx.fileId);
      } else if (previousLocalItem && previousLocalItem.quantity > 1) {
        decrementQuantity(ctx.fileId);
      }

      queryClient.setQueryData<IUserCart>(queryKey, (old) => {
        if (!old) return old;

        return {
          ...old,
          data: (old.data ?? []).map((item) => {
            if (item.fileId !== ctx.fileId) return item;

            return {
              ...item,
              quantity:
                ctx.opts === "add"
                  ? item.quantity + 1
                  : Math.max(1, item.quantity - 1),
            };
          }),
        };
      });

      return { previousCart, previousLocalItem };
    },

    onError: (_error, _ctx, context) => {
      if (!userId) return;

      if (context?.previousLocalItem) {
        addToCart({
          fileId: context.previousLocalItem.fileId,
          quantity: context.previousLocalItem.quantity,
          price:
            context.previousLocalItem.quantity > 0
              ? context.previousLocalItem.price! /
                context.previousLocalItem.quantity
              : 0,
          url: context.previousLocalItem.url,
        });
      }

      if (context?.previousCart) {
        queryClient.setQueryData(
          [`fetch-user-cart-${userId}`],
          context.previousCart,
        );
      }
    },

    onSettled: () => {
      if (!userId) return;

      queryClient.invalidateQueries({
        queryKey: [`fetch-user-cart-${userId}`],
      });
    },
  });
};
