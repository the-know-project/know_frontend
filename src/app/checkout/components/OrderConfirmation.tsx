"use client";

import Image from "next/image";
import { Button } from "../../../shared/ui/button";
import { Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

// Sample cart data
const cartItems = [
  {
    id: 1,
    title: "Burgeoning",
    artist: "Tonye Abraham",
    price: 1200,
    image: "/Painting1.png", // replace with actual public path
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
    router.push("/checkout/shipping");
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6 px-4 py-8 sm:px-0">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">Order Details</h2>
        <p className="text-sm text-gray-500">
          Review and confirm your order details.
        </p>
      </div>

      {/* Items */}
      <div className="space-y-6">
        {cartItems.map((item) => (
          <div key={item.id} className="flex gap-4">
            <Image
              src={item.image}
              alt={item.title}
              width={100}
              height={100}
              className="h-24 w-24 rounded-md object-cover"
            />
            <div className="flex-1">
              <h4 className="text-sm text-gray-600">{item.artist}</h4>
              <p className="text-md font-medium text-gray-900">{item.title}</p>
              <p className="mt-1 text-sm">${item.price}</p>
            </div>

            {/* Quantity Selector */}
            <div className="flex h-9 items-center gap-2 rounded-md border px-2 py-1">
              <button type="button" onClick={() => updateQuantity(item.id, -1)}>
                <Minus className="h-4 w-4 text-gray-500" />
              </button>
              <span className="w-4 text-center">{quantities[item.id]}</span>
              <button type="button" onClick={() => updateQuantity(item.id, 1)}>
                <Plus className="h-4 w-4 text-gray-500" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="space-y-2 border-t pt-6 text-sm text-gray-700">
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
        <div className="flex justify-between border-t pt-4 text-base font-semibold text-gray-900">
          <span>Total</span>
          <span>${total}</span>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="pt-4">
        <Button
          onClick={handleSubmit}
          className="w-full bg-[#1F3C88] text-base text-white hover:bg-[#1a3474]"
        >
          Confirm Order
        </Button>
      </div>
    </div>
  );
}
