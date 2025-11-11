"use client";
import { X, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useFetchUserCart } from "../hooks/use-fetch-user-cart";
import { useBulkCartActions } from "../hooks/use-cart";
import { CartEmpty } from "./cart-empty";
import { CartItem } from "./cart-item";
import { CartSummary } from "./cart-summary";
import { TCart } from "../types/cart.types";

interface ICartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CartDrawer: React.FC<ICartDrawerProps> = ({ isOpen, onClose }) => {
  const { data, isLoading, error } = useFetchUserCart();
  const { initCart } = useBulkCartActions();

  // Sync cart with backend on mount
  useEffect(() => {
    if (data?.data) {
      const cartItems = data.data.map((item) => ({
        fileId: item.fileId,
        quantity: item.quantity,
      }));
      initCart(cartItems);
    }
  }, [data, initCart]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  const cartItems = (data?.data || []) as TCart[];

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="bg-opacity-50 fixed inset-0 z-40 bg-black transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-full transform bg-white shadow-xl transition-transform duration-300 ease-in-out sm:w-96 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-4">
          <h2 className="font-bricolage text-xl font-bold">
            Shopping Cart {cartItems.length > 0 && `(${cartItems.length})`}
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-gray-100"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <div className="h-[calc(100%-140px)] overflow-y-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center px-4 py-12">
              <div className="text-center">
                <p className="mb-2 font-medium text-red-500">
                  Failed to load cart
                </p>
                <p className="text-sm text-gray-500">
                  {error instanceof Error ? error.message : "An error occurred"}
                </p>
              </div>
            </div>
          ) : cartItems.length === 0 ? (
            <CartEmpty onClose={onClose} />
          ) : (
            <div className="p-4">
              {cartItems.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
          )}
        </div>

        {/* Footer - Summary */}
        {!isLoading && !error && cartItems.length > 0 && (
          <div className="absolute right-0 bottom-0 left-0 border-t border-gray-200 bg-white p-4">
            <CartSummary items={cartItems} onClose={onClose} />
          </div>
        )}
      </div>
    </>
  );
};
