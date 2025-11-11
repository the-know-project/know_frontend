"use client";
import { ShoppingCart } from "lucide-react";
import Link from "next/link";

interface ICartEmptyProps {
  onClose?: () => void;
}

export const CartEmpty: React.FC<ICartEmptyProps> = ({ onClose }) => {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12">
      <div className="mb-4 rounded-full bg-gray-100 p-6">
        <ShoppingCart className="h-12 w-12 text-gray-400" />
      </div>
      <h3 className="font-bricolage mb-2 text-xl font-semibold text-gray-900">
        Your cart is empty
      </h3>
      <p className="mb-6 text-center text-gray-500">
        Browse our marketplace and add items to your cart
      </p>
      <Link
        href="/explore"
        onClick={onClose}
        className="rounded-md bg-black px-6 py-3 font-medium text-white transition-colors hover:bg-gray-800"
      >
        Start Shopping
      </Link>
    </div>
  );
};
