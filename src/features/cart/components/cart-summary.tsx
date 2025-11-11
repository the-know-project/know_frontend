"use client";
import { TCart } from "../types/cart.types";
import Link from "next/link";

interface ICartSummaryProps {
  items: TCart[];
  onClose?: () => void;
}

export const CartSummary: React.FC<ICartSummaryProps> = ({
  items,
  onClose,
}) => {
  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  return (
    <div className="mt-4 border-t border-gray-200 pt-4">
      <div className="mb-4 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Subtotal</span>
          <span className="font-medium">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Tax (10%)</span>
          <span className="font-medium">${tax.toFixed(2)}</span>
        </div>
        <div className="font-bricolage flex justify-between border-t border-gray-200 pt-2 text-lg font-bold">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      <Link
        href="/checkout"
        onClick={onClose}
        className="mb-2 block w-full rounded-md bg-black py-3 text-center font-medium text-white transition-colors hover:bg-gray-800"
      >
        Proceed to Checkout
      </Link>

      <button
        onClick={onClose}
        className="block w-full rounded-md bg-gray-100 py-3 text-center font-medium text-gray-900 transition-colors hover:bg-gray-200"
      >
        Continue Shopping
      </button>
    </div>
  );
};
