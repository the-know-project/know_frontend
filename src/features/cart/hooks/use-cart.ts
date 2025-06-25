import { useState } from "react";
import {
  useCartActions,
  useGetTotalItemsCount,
  useIsItemInCart,
} from "../state/cart.store";
import { useAddToCart } from "./use-add-to-cart";
import { useRemoveFromCart } from "./use-remove-from-cart";
import { TCart } from "../types/cart.types";

interface IUseCartProps {
  fileId: string;
}

export const useCart = ({ fileId }: IUseCartProps) => {
  const { mutateAsync: handleAddToCart, isPending: isAdding } = useAddToCart();
  const { mutateAsync: handleRemoveFromCart, isPending: isRemoving } =
    useRemoveFromCart();

  const isItemInCart = useIsItemInCart(fileId);
  const totalItemsInCart = useGetTotalItemsCount();
  const { addToCart, removeFromCart } = useCartActions();

  const [error, setError] = useState<string | null>(null);

  const toggleCart = async () => {
    const wasInCart = isItemInCart;

    try {
      if (!wasInCart) {
        addToCart(fileId);
      } else {
        removeFromCart(fileId);
      }

      if (!wasInCart) {
        await handleAddToCart(fileId);
      } else {
        await handleRemoveFromCart(fileId);
      }
    } catch (apiError) {
      if (!wasInCart) {
        removeFromCart(fileId);
      } else {
        addToCart(fileId);
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
    toggleCart,
    isLoading: isAdding || isRemoving,
    error,
  };
};

export const useItemInCart = (fileId: string) => {
  const isItemInCart = useIsItemInCart(fileId);
  return isItemInCart;
};

export const useBulkCartActins = () => {
  const { initializeCart, clearCartItems } = useCartActions();

  const initCart = (ctx: TCart[]) => {
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
