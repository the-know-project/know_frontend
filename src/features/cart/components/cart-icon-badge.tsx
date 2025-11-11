"use client";
import { ShoppingCart } from "lucide-react";
import { useGetTotalItemsCount } from "../state/cart.store";

interface ICartIconBadgeProps {
  onClick?: () => void;
  className?: string;
}

export const CartIconBadge: React.FC<ICartIconBadgeProps> = ({
  onClick,
  className = "",
}) => {
  const totalItems = useGetTotalItemsCount();

  return (
    <button
      onClick={onClick}
      className={`relative rounded-full p-2 transition-colors hover:bg-gray-100 ${className}`}
      aria-label={`Cart with ${totalItems} items`}
    >
      <ShoppingCart className="h-6 w-6" />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs font-bold text-white">
          {totalItems > 99 ? "99+" : totalItems}
        </span>
      )}
    </button>
  );
};
