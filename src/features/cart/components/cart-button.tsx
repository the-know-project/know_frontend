"use client";
import { Heart, ShoppingCart, Loader2 } from "lucide-react";
import { useCart } from "../hooks/use-cart";

interface ICartButtonProps {
  fileId: string;
  variant?: "icon" | "button";
  className?: string;
}

export const CartButton: React.FC<ICartButtonProps> = ({
  fileId,
  variant = "button",
  className = "",
}) => {
  const { isItemInCart, toggleCart, isLoading, error } = useCart({
    fileId,
    enabled: true,
  });

  if (variant === "icon") {
    return (
      <button
        onClick={toggleCart}
        disabled={isLoading}
        className={`rounded-full p-2 transition-colors hover:bg-gray-100 ${
          isItemInCart ? "text-red-500" : "text-gray-600"
        } ${className}`}
        aria-label={isItemInCart ? "Remove from cart" : "Add to cart"}
      >
        {isLoading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : isItemInCart ? (
          <Heart className="h-5 w-5 fill-current" />
        ) : (
          <ShoppingCart className="h-5 w-5" />
        )}
      </button>
    );
  }

  return (
    <button
      onClick={toggleCart}
      disabled={isLoading}
      className={`flex items-center gap-2 rounded-md px-4 py-2 font-medium transition-colors ${
        isItemInCart
          ? "bg-red-500 text-white hover:bg-red-600"
          : "bg-black text-white hover:bg-gray-800"
      } disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {isItemInCart ? (
            <>
              <Heart className="h-4 w-4 fill-current" />
              <span>Remove from Cart</span>
            </>
          ) : (
            <>
              <ShoppingCart className="h-4 w-4" />
              <span>Add to Cart</span>
            </>
          )}
        </>
      )}
    </button>
  );
};
