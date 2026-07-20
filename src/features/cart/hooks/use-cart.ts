import { useState } from "react";
import {
  ICartItems,
  useCartActions,
  useGetTotalItemsCount,
  useIsItemInCart,
} from "../state/cart.store";
import { useAddToCart } from "./use-add-to-cart";
import { useRemoveFromCart } from "./use-remove-from-cart";
import { IAddToLocalCart } from "../types/cart.types";

interface IUseCartProps {
  ctx: IAddToLocalCart;

  enabled?: boolean;
}

export const useCart = ({ ctx, enabled = true }: IUseCartProps) => {
  const { mutateAsync: handleAddToCart, isPending: isAdding } = useAddToCart({
    enabled,
  });
  const { mutateAsync: handleRemoveFromCart, isPending: isRemoving } =
    useRemoveFromCart({ enabled });

  const isItemInCart = useIsItemInCart(ctx.fileId);
  const totalItemsInCart = useGetTotalItemsCount();
  const { addToCart, removeFromCart, getItemProps } = useCartActions();

  const [error, setError] = useState<string | null>(null);

  const toggleCart = async () => {
    const wasInCart = isItemInCart;

    try {
      if (!wasInCart) {
        addToCart(ctx);
      } else {
        removeFromCart(ctx.fileId);
      }

      if (!wasInCart) {
        await handleAddToCart(ctx);
      } else {
        await handleRemoveFromCart(ctx);
      }
    } catch (apiError) {
      if (!wasInCart) {
        removeFromCart(ctx.fileId);
      } else {
        addToCart(ctx);
      }

      const errorMessage =
        apiError instanceof Error
          ? apiError.message
          : "Failed to perform cart operation";

      setError(errorMessage);
      console.error("Error updating cart:", apiError);
    }
  };

  return {
    isItemInCart,
    totalItemsInCart,
    getItemProps,
    toggleCart,
    isLoading: isAdding || isRemoving,
    error,
  };
};

export const useItemInCart = (fileId: string) => {
  const isItemInCart = useIsItemInCart(fileId);
  return isItemInCart;
};
export const useBulkCartActions = () => {
  const { initializeCart, clearCartItems } = useCartActions();

  const initCart = (ctx: ICartItems[]) => {
    initializeCart(ctx);
  };

  const clearCart = () => {
    clearCartItems();
  };

  return {
    initCart,
    clearCart,
  };
};
