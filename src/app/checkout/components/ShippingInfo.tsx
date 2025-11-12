"use client";

import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Button } from "@/src/shared/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";

export function ShippingInfo() {
  const router = useRouter();
  const [deliveryMethod, setDeliveryMethod] = useState<"delivery" | "pickup">(
    "delivery",
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/checkout/confirm");
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-8 px-6 py-8">
      {/* Heading */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-gray-900">
          Shipping Information
        </h2>
        <p className="text-base text-gray-500">
          Enter the correct details to ensure successful delivery to this
          address.
        </p>
      </div>

      {/* Delivery Method Toggle */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setDeliveryMethod("delivery")}
          className={`flex flex-1 items-center justify-center gap-3 rounded-lg border-2 px-6 py-4 transition-all ${
            deliveryMethod === "delivery"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              deliveryMethod === "delivery"
                ? "border-orange-500"
                : "border-gray-400"
            }`}
          >
            {deliveryMethod === "delivery" && (
              <div className="h-3 w-3 rounded-full bg-orange-500" />
            )}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span className="text-base font-medium text-gray-900">Delivery</span>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryMethod("pickup")}
          className={`flex flex-1 items-center justify-center gap-3 rounded-lg border-2 px-6 py-4 transition-all ${
            deliveryMethod === "pickup"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          }`}
        >
          <div
            className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
              deliveryMethod === "pickup"
                ? "border-orange-500"
                : "border-gray-400"
            }`}
          >
            {deliveryMethod === "pickup" && (
              <div className="h-3 w-3 rounded-full bg-orange-500" />
            )}
          </div>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-gray-700"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-base font-medium text-gray-900">Pickup</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="full-name" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="full-name"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              className="h-11"
              required
            />
          </div>
        </div>

        {/* Phone Number & Country */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country" className="text-sm font-medium">
              Country
            </Label>
            <select
              id="country"
              name="country"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
              required
            >
              <option value="">Select country</option>
              <option value="NG">Nigeria</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
            </select>
          </div>
        </div>

        {/* City, State & ZIP Code */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="city" className="text-sm font-medium">
              City
            </Label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Enter city"
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state" className="text-sm font-medium">
              State
            </Label>
            <Input
              id="state"
              name="state"
              type="text"
              placeholder="Enter state"
              className="h-11"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="zip" className="text-sm font-medium">
              ZIP Code
            </Label>
            <Input
              id="zip"
              name="zip"
              type="text"
              placeholder="Enter ZIP code"
              className="h-11"
              required
            />
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="pt-6">
          <Button
            type="submit"
            className="h-10 w-full bg-[#1E3A8A] text-base font-semibold text-white hover:bg-[#1a3474]"
          >
            Make payment
          </Button>
        </div>
      </form>
    </div>
  );
}
