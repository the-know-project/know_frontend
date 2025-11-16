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
    <div className="mx-auto w-full max-w-xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-8 md:px-0">
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-[15px] leading-tight font-semibold text-gray-900 sm:text-base md:text-lg">
          Shipping Information
        </h2>
        <p className="text-[11px] leading-snug text-gray-500 sm:text-xs md:text-sm">
          Enter the correct details to ensure successful delivery to this
          address.
        </p>
      </div>

      {/* Delivery Method Toggle */}
      <div className="flex gap-2 sm:gap-3 md:gap-4">
        <button
          type="button"
          onClick={() => setDeliveryMethod("delivery")}
          className={`flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 transition-colors active:scale-95 sm:gap-1.5 sm:px-3 sm:py-2.5 md:gap-2 md:px-4 md:py-3 ${
            deliveryMethod === "delivery"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-white"
          }`}
        >
          <div
            className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
              deliveryMethod === "delivery"
                ? "border-orange-500"
                : "border-gray-400"
            }`}
          >
            {deliveryMethod === "delivery" && (
              <div className="h-[10px] w-[10px] rounded-full bg-orange-500 sm:h-2 sm:w-2 md:h-3 md:w-3" />
            )}
          </div>
          <svg
            className="h-[14px] w-[14px] flex-shrink-0 sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
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
          <span className="text-[11px] font-medium sm:text-xs md:text-sm">
            Delivery
          </span>
        </button>

        <button
          type="button"
          onClick={() => setDeliveryMethod("pickup")}
          className={`flex min-h-[44px] flex-1 items-center justify-center gap-1 rounded-lg border px-2 py-2 transition-colors active:scale-95 sm:gap-1.5 sm:px-3 sm:py-2.5 md:gap-2 md:px-4 md:py-3 ${
            deliveryMethod === "pickup"
              ? "border-orange-500 bg-orange-50"
              : "border-gray-300 bg-white"
          }`}
        >
          <div
            className={`flex h-[18px] w-[18px] flex-shrink-0 items-center justify-center rounded-full border-2 sm:h-4 sm:w-4 md:h-5 md:w-5 ${
              deliveryMethod === "pickup"
                ? "border-orange-500"
                : "border-gray-400"
            }`}
          >
            {deliveryMethod === "pickup" && (
              <div className="h-[10px] w-[10px] rounded-full bg-orange-500 sm:h-2 sm:w-2 md:h-3 md:w-3" />
            )}
          </div>
          <svg
            className="h-[14px] w-[14px] flex-shrink-0 sm:h-[15px] sm:w-[15px] md:h-4 md:w-4"
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
          <span className="text-[11px] font-medium sm:text-xs md:text-sm">
            Pickup
          </span>
        </button>
      </div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 sm:space-y-4 md:space-y-5"
      >
        {/* Full Name & Email */}
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0 md:gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="full-name"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              Full Name
            </Label>
            <Input
              id="full-name"
              name="fullName"
              type="text"
              placeholder="Enter full name"
              className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="email"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              Email Address
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Enter email address"
              className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
              required
            />
          </div>
        </div>

        {/* Phone Number & Country */}
        <div className="space-y-4 sm:grid sm:grid-cols-2 sm:gap-3 sm:space-y-0 md:gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="phone"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              Phone Number
            </Label>
            <Input
              id="phone"
              name="phone"
              type="tel"
              placeholder="Enter phone number"
              className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="country"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              Country
            </Label>
            <select
              id="country"
              name="country"
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-11 w-full rounded-md border px-3 py-2 text-[13px] file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 sm:h-10 sm:text-sm md:h-11 md:text-base"
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
        <div className="space-y-4 sm:grid sm:grid-cols-3 sm:gap-3 sm:space-y-0 md:gap-4">
          <div className="space-y-1.5">
            <Label
              htmlFor="city"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              City
            </Label>
            <Input
              id="city"
              name="city"
              type="text"
              placeholder="Enter city"
              className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="state"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              State
            </Label>
            <Input
              id="state"
              name="state"
              type="text"
              placeholder="Enter state"
              className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
              required
            />
          </div>

          <div className="space-y-1.5">
            <Label
              htmlFor="zip"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              ZIP Code
            </Label>
            <Input
              id="zip"
              name="zip"
              type="text"
              placeholder="ZIP"
              className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
              required
            />
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="pt-2 sm:pt-3 md:pt-4">
          <Button
            type="submit"
            className="min-h-[48px] w-full bg-[#1E3A8A] text-[14px] font-semibold text-white transition-transform hover:bg-[#1a3474] active:scale-98 sm:min-h-[44px] sm:text-sm md:min-h-[48px] md:text-base"
          >
            Make payment
          </Button>
        </div>
      </form>
    </div>
  );
}
