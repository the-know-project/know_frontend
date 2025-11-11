"use client";
import { Trash2, Plus, Minus } from "lucide-react";
import Image from "next/image";
import { useCartActions } from "../state/cart.store";
import { TCart } from "../types/cart.types";

interface ICartItemProps {
  item: TCart;
}

export const CartItem: React.FC<ICartItemProps> = ({ item }) => {
  const { removeFromCart, incrementQuantity, decrementQuantity } =
    useCartActions();

  const handleIncrement = () => {
    incrementQuantity(item.fileId);
  };

  const handleDecrement = () => {
    if (item.quantity > 1) {
      decrementQuantity(item.fileId);
    } else {
      removeFromCart(item.fileId);
    }
  };

  const handleRemove = () => {
    removeFromCart(item.fileId);
  };

  const subtotal = item.price * item.quantity;

  return (
    <div className="flex gap-4 border-b border-gray-200 py-4">
      {/* Image */}
      <div className="relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-gray-100">
        <Image
          src={item.url || "/placeholder.png"}
          alt="Product"
          fill
          className="object-cover"
        />
      </div>

      {/* Details */}
      <div className="flex flex-1 flex-col">
        <div className="mb-2 flex justify-between">
          <h4 className="font-bricolage font-semibold text-gray-900">
            Artwork #{item.fileId.slice(0, 8)}
          </h4>
          <button
            onClick={handleRemove}
            className="text-red-500 transition-colors hover:text-red-700"
            aria-label="Remove item"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>

        <p className="mb-2 text-sm text-gray-500">${item.price.toFixed(2)}</p>

        <div className="mt-auto flex items-center justify-between">
          {/* Quantity Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleDecrement}
              className="rounded-md p-1 transition-colors hover:bg-gray-100"
              aria-label="Decrease quantity"
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">
              {item.quantity}
            </span>
            <button
              onClick={handleIncrement}
              className="rounded-md p-1 transition-colors hover:bg-gray-100"
              aria-label="Increase quantity"
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>

          {/* Subtotal */}
          <span className="font-bricolage font-semibold text-gray-900">
            ${subtotal.toFixed(2)}
          </span>
        </div>
      </div>
    </div>
  );
};
