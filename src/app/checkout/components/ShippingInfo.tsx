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
    // Navigate to order confirmation
    router.push("/checkout/confirm");
  };

  return (
    <div className="mx-auto max-w-xl space-y-6 px-4 py-8 sm:px-0">
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Shipping Information
        </h2>
        <p className="text-sm text-gray-500">
          Enter the correct details to ensure successful delivery to this
          address.
        </p>
      </div>

      {/* Delivery Method Toggle */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={() => setDeliveryMethod("delivery")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
            deliveryMethod === "delivery"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-white"
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="1" y="3" width="15" height="13"></rect>
            <polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon>
            <circle cx="5.5" cy="18.5" r="2.5"></circle>
            <circle cx="18.5" cy="18.5" r="2.5"></circle>
          </svg>
          <span className="text-sm font-medium">Delivery</span>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryMethod("pickup")}
          className={`flex flex-1 items-center justify-center gap-2 rounded-lg border px-4 py-3 transition-colors ${
            deliveryMethod === "pickup"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-white"
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
            <polyline points="9 22 9 12 15 12 15 22"></polyline>
          </svg>
          <span className="text-sm font-medium">Pickup</span>
        </button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Full Name & Email */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              required
            />
          </div>
        </div>

        {/* Phone Number & Country */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-1">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="country">Country</Label>
            <select
              id="country"
              name="country"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="space-y-1">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Enter city"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="state">State</Label>
            <Input
              id="state"
              name="state"
              type="text"
              placeholder="Enter state"
              required
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="zip">ZIP Code</Label>
            <Input
              id="zip"
              name="zip"
              type="text"
              placeholder="Enter ZIP code"
              required
            />
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="pt-4">
          <Button
            type="submit"
            className="w-full bg-[#1E3A8A] text-base text-white hover:bg-[#1a3474]"
          >
            Make payment
          </Button>
        </div>
      </form>
    </div>
  );
}
