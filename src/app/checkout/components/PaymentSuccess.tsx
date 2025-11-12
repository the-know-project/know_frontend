"use client";

import { Button } from "../../../shared/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function PaymentSuccess() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/"); // or wherever you want to redirect after success
  };

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-0">
      {/* Success Modal */}
      <div className="relative rounded-lg bg-white p-8 shadow-lg">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          aria-label="Close"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        </div>

        {/* Success Message */}
        <div className="text-center">
          <h2 className="mb-2 text-xl font-semibold text-gray-900">
            Order successfully completed.
          </h2>
          <p className="text-sm text-gray-500">
            Your transaction is complete—check your mail for your support
            ticket.
          </p>
        </div>

        {/* Divider */}
        <div className="my-8 border-t border-gray-200" />

        {/* Shipping Information Display */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-900">
            Shipping Information
          </h3>

          <div className="space-y-3 text-sm text-gray-600">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Full Name</p>
                <p className="font-medium text-gray-900">Enter</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Email Address</p>
                <p className="font-medium text-gray-900">Enter</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-gray-500">Phone Number</p>
                <p className="font-medium text-gray-900">Enter</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Country</p>
                <p className="font-medium text-gray-900">Select country</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-gray-500">City</p>
                <p className="font-medium text-gray-900">Enter city</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">State</p>
                <p className="font-medium text-gray-900">Enter state</p>
              </div>
              <div>
                <p className="text-xs text-gray-500">ZIP Code</p>
                <p className="font-medium text-gray-900">Enter ZIP code</p>
              </div>
            </div>
          </div>
        </div>

        {/* Make Payment Button */}
        <div className="mt-8">
          <Button
            onClick={handleClose}
            className="w-full bg-[#1E3A8A] text-base text-white hover:bg-[#1a3474]"
          >
            Make payment
          </Button>
        </div>
      </div>
    </div>
  );
}
