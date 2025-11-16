"use client";
import { Button } from "@/src/shared/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function PaymentSuccess() {
  const router = useRouter();

  const handleClose = () => {
    router.push("/");
  };

  return (
    <div className="mx-auto w-full max-w-xl px-3 py-4 sm:px-6 sm:py-6 md:px-0 md:py-8">
      {/* Success Modal */}
      <div className="relative rounded-lg bg-white p-4 shadow-lg sm:p-6 md:p-8">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-2 rounded-full p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 active:scale-95 sm:top-3 sm:right-3 md:top-4 md:right-4"
          aria-label="Close"
        >
          <X className="h-4 w-4 sm:h-4.5 sm:w-4.5 md:h-5 md:w-5" />
        </button>

        {/* Success Icon */}
        <div className="mb-4 flex justify-center sm:mb-5 md:mb-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 sm:h-16 sm:w-16 md:h-20 md:w-20">
            <svg
              className="h-7 w-7 text-green-600 sm:h-8 sm:w-8 md:h-10 md:w-10"
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
          <h2 className="mb-1.5 text-[15px] leading-tight font-semibold text-gray-900 sm:mb-2 sm:text-base md:text-lg">
            Order successfully completed.
          </h2>
          <p className="text-[11px] leading-snug text-gray-500 sm:text-xs md:text-sm">
            Your transaction is complete—check your mail for your support
            ticket.
          </p>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200 sm:my-6 md:my-8" />

        {/* Shipping Information Display */}
        <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
          <h3 className="text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
            Shipping Information
          </h3>

          <div className="space-y-3 sm:space-y-3.5">
            {/* Full Name & Email */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:gap-4">
              <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  Full Name
                </p>
                <p className="text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Enter
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  Email Address
                </p>
                <p className="text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Enter
                </p>
              </div>
            </div>

            {/* Phone & Country */}
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:gap-4">
              <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  Phone Number
                </p>
                <p className="text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Enter
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  Country
                </p>
                <p className="text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Select country
                </p>
              </div>
            </div>

            {/* City, State & ZIP */}
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
              <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  City
                </p>
                <p className="truncate text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Enter city
                </p>
              </div>
              <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  State
                </p>
                <p className="truncate text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Enter state
                </p>
              </div>
              <div className="col-span-2 rounded-md bg-gray-50 p-2.5 sm:col-span-1 sm:p-3">
                <p className="mb-1 text-[10px] font-medium text-gray-500 sm:text-xs">
                  ZIP Code
                </p>
                <p className="text-[12px] font-semibold text-gray-900 sm:text-xs md:text-sm">
                  Enter ZIP
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Close/Continue Button */}
        <div className="mt-5 sm:mt-6 md:mt-8">
          <Button
            onClick={handleClose}
            className="min-h-[48px] w-full bg-[#1E3A8A] text-[14px] font-semibold text-white transition-transform hover:bg-[#1a3474] active:scale-98 sm:min-h-[44px] sm:text-sm md:min-h-[48px] md:text-base"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
}
