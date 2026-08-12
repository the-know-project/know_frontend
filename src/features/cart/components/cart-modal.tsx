"use client";

import ReactDOM from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { IconShoppingCart, IconTrash, IconX } from "@tabler/icons-react";
import { useFetchUserCart } from "../hooks/use-fetch-user-cart";
import { useClearCart } from "../hooks/use-clear-cart";
import Spinner from "@/src/shared/components/spinner";
import { toast } from "sonner";
import ToastIcon from "@/src/shared/components/toast-icon";
import ToastDescription from "@/src/shared/components/toast-description";

export interface ICartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CartModal: React.FC<ICartModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { data: cartOrdersData, isLoading: cartLoading } = useFetchUserCart();
  const { mutateAsync: clearCart, isPending: isClearing } = useClearCart();

  if (!isOpen) return null;

  const cartItems = cartOrdersData?.data || [];
  const cartMeta = cartOrdersData?.meta || {
    subTotal: "#0.00",
    totalQuantity: 0,
    fixedShippingFee: "#0.00",
    total: "#0.00",
  };

  const handleClearCart = async () => {
    try {
      await clearCart();
      toast.success("Cart cleared successfully", {
        icon: <ToastIcon />,
        description: (
          <ToastDescription description="All items removed from your cart." />
        ),
        style: {
          backgroundColor: "oklch(62.7% 0.194 149.214)",
          fontSize: "15px",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
    } catch (error) {
      toast.error("Failed to clear cart", {
        icon: <ToastIcon />,
        description: (
          <ToastDescription description="Could not clear your cart. Please try again." />
        ),
        style: {
          backgroundColor: "oklch(62.8% 0.258 29.234)",
          fontSize: "15px",
          fontFamily: "Space Grotesk",
          color: "#ffffff",
          fontWeight: "600",
        },
      });
    }
  };

  return ReactDOM.createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              delay: 0.05,
              ease: "easeInOut",
              duration: 0.09,
            }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative z-10 w-full max-w-sm rounded-lg bg-white p-6 shadow-lg sm:max-w-md"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-bebas flex items-center gap-2 text-xl font-semibold tracking-wider text-neutral-900">
                <IconShoppingCart className="h-8 w-8 text-[#1E3A8A]" />
                Your Cart
              </h2>
              <button
                onClick={onClose}
                className="text-neutral-400 transition-colors hover:text-neutral-600"
              >
                <IconX className="h-5 w-5" />
              </button>
            </div>

            {/* Cart Items List */}
            {cartLoading ? (
              <div className="flex h-40 items-center justify-center">
                <Spinner />
              </div>
            ) : cartItems.length === 0 ? (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="font-grotesk font-medium text-neutral-500 capitalize">
                  Your cart is empty
                </p>
                <button
                  onClick={onClose}
                  className="font-bebas mt-4 text-xs font-semibold text-[#1E3A8A] uppercase hover:underline"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {/* Scrollable list */}
                <div className="font-grotesk flex max-h-60 flex-col gap-3 overflow-y-auto pr-1">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-3 border-b border-neutral-100 pb-3 last:border-0 last:pb-0"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded-md bg-neutral-100">
                        <Image
                          src={item.url || "/placeholder-art.jpg"}
                          alt={item.title || "Artwork"}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="font-helvetica truncate text-sm font-semibold text-neutral-800">
                          {item.title || "Untitled"}
                        </h4>
                        <p className="text-xs text-neutral-500">
                          Qty: {item.quantity}
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-bold text-neutral-800">
                          {item.price}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Subtotal */}
                <div className="font-grotesk flex items-center justify-between border-t border-neutral-200 pt-4">
                  <span className="text-sm font-semibold text-neutral-600">
                    Subtotal:
                  </span>
                  <span className="text-lg font-bold text-neutral-900">
                    {cartMeta.subTotal}
                  </span>
                </div>

                {/* Actions */}
                <div className="mt-2 flex flex-col gap-2">
                  <button
                    onClick={() => {
                      onClose();
                      router.push("/checkout");
                    }}
                    className="font-bebas w-full rounded-lg bg-[#1E3A8A] py-2 text-center text-sm font-semibold tracking-wider text-white uppercase transition-colors hover:bg-[#1a3474]"
                  >
                    Checkout
                  </button>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={handleClearCart}
                      disabled={isClearing}
                      className="font-bebas flex items-center justify-center gap-1 rounded-lg border border-neutral-300 py-2 text-center text-xs font-semibold tracking-wider text-red-500 uppercase transition-colors hover:bg-neutral-50"
                    >
                      <IconTrash className="h-4 w-4" />
                      Clear Cart
                    </button>

                    <button
                      onClick={() => {
                        onClose();
                        router.push("/buyer-profile");
                      }}
                      className="font-bebas rounded-lg border border-neutral-300 py-2 text-center text-xs font-semibold tracking-wider text-neutral-600 uppercase transition-colors hover:bg-neutral-50"
                    >
                      View Cart
                    </button>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default CartModal;
