"use client";
import Image from "next/image";
import { Button } from "@/src/shared/ui/button";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

const cartItems = [
  {
    id: 1,
    title: "Burgeoning",
    artist: "Tonye Abraham",
    price: 1200,
    image: "/Painting1.png",
  },
  {
    id: 2,
    title: "Bubble Fish",
    artist: "Hyacinth Luigi",
    price: 2000,
    image: "/Painting2.png",
  },
];

export function OrderConfirmation() {
  const router = useRouter();
  const [quantities, setQuantities] = useState<{ [id: number]: number }>({
    1: 1,
    2: 1,
  });

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * quantities[item.id],
    0,
  );
  const shippingFee = 150;
  const total = subtotal + shippingFee;

  const updateQuantity = (id: number, delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, (prev[id] || 1) + delta),
    }));
  };

  const handleSubmit = () => {
    router.push("/checkout/success");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-0 sm:py-8">
      {/* Heading */}
      <div>
        <h2 className="text-base font-semibold text-gray-900 sm:text-lg">
          Order Details
        </h2>
        <p className="text-xs text-gray-500 sm:text-sm">
          Review and confirm your order details.
        </p>
      </div>

      {/* Items */}
      <div className="space-y-4 sm:space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-3 sm:gap-4">
            <Image
              src={item.image}
              alt={item.title}
              width={80}
              height={80}
              className="h-20 w-20 flex-shrink-0 rounded-md object-cover sm:h-24 sm:w-24"
            />
            <div className="flex min-w-0 flex-1 flex-col justify-between">
              <div>
                <h4 className="text-xs text-gray-600 sm:text-sm">
                  {item.artist}
                </h4>
                <p className="text-sm font-medium text-gray-900 sm:text-base">
                  {item.title}
                </p>
                <p className="mt-1 text-xs sm:text-sm">${item.price}</p>
              </div>
            </div>

            {/* Quantity Selector */}
            <div className="flex h-8 flex-shrink-0 items-center gap-1.5 rounded-md border px-2 sm:h-9 sm:gap-2">
              <button
                type="button"
                onClick={() => updateQuantity(item.id, -1)}
                className="p-0.5"
              >
                <Minus className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
              </button>
              <span className="w-4 text-center text-xs sm:text-sm">
                {quantities[item.id]}
              </span>
              <button
                type="button"
                onClick={() => updateQuantity(item.id, 1)}
                className="p-0.5"
              >
                <Plus className="h-3 w-3 text-gray-500 sm:h-4 sm:w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2 border-t pt-4 text-xs text-gray-700 sm:pt-6 sm:text-sm">
        <div className="flex justify-between">
          <span>Subtotal</span>
          <span>${subtotal}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping fee</span>
          <span>${shippingFee}</span>
        </div>
        <div className="flex justify-between text-xs text-blue-600">
          <button type="button" onClick={() => alert("Apply discount flow")}>
            Apply discount code
          </button>
        </div>
        <div className="flex justify-between border-t pt-3 text-sm font-semibold text-gray-900 sm:pt-4 sm:text-base">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-3 sm:pt-4">
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#1F3C88] py-2.5 text-sm text-white hover:bg-[#1a3474] sm:py-3 sm:text-base"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
