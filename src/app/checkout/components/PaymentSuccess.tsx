"use client";
import { useClearCart } from "@/src/features/cart/hooks/use-clear-cart";
import { useFetchShippingInfo } from "@/src/features/shipping/hooks/use-fetch-shipping-info";
import { Button } from "@/src/shared/ui/button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

export function ShippingInformationSkeleton() {
  return (
    <div
      className="space-y-3 sm:space-y-3.5"
      role="status"
      aria-label="Loading shipping information"
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:gap-4">
        {["Full Name", "Email Address"].map((label) => (
          <div key={label} className="rounded-md bg-gray-50 p-2.5 sm:p-3">
            <div className="mb-2 h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-300" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:gap-4">
        {["Phone Number", "Country"].map((label) => (
          <div key={label} className="rounded-md bg-gray-50 p-2.5 sm:p-3">
            <div className="mb-2 h-3 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-28 animate-pulse rounded bg-gray-300" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
        {["w-16", "w-20", "w-14"].map((width, index) => (
          <div
            key={index}
            className={`rounded-md bg-gray-50 p-2.5 sm:p-3 ${index === 2 ? "col-span-2 sm:col-span-1" : ""}`}
          >
            <div className="mb-2 h-3 w-14 animate-pulse rounded bg-gray-200" />
            <div className={`h-4 ${width} animate-pulse rounded bg-gray-300`} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function PaymentSuccess() {
  const { data: shippingInfo, isLoading, isFetching } = useFetchShippingInfo();
  const { mutateAsync: clearUserCart } = useClearCart();
  const router = useRouter();

  const shippingData = shippingInfo?.data;

  const handleClose = async () => {
    await clearUserCart();
    router.push("/explore");
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
          <h2 className="font-bebas mb-1.5 text-lg tracking-wider text-neutral-800 md:text-xl">
            Order successfully completed.
          </h2>
          <p className="font-grotesk text-xs text-neutral-600 sm:text-sm">
            Your transaction is complete, please check your mail for your
            support. ticket.
          </p>
        </div>

        {/* Divider */}
        <div className="my-5 border-t border-gray-200 sm:my-6 md:my-8" />

        {/* Shipping Information Display */}
        <div className="space-y-3 sm:space-y-3.5 md:space-y-4">
          <h3 className="shipping_info_label">Shipping Information</h3>

          {isLoading || isFetching ? (
            <ShippingInformationSkeleton />
          ) : (
            <div className="font-grotesk space-y-3 sm:space-y-3.5">
              {/* Phone & Country */}
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-3.5 md:gap-4">
                <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                  <p className="shipping_info_label">Phone Number</p>
                  <p className="shipping_info_content mb-1">
                    {shippingData?.phoneNumber || ""}
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                  <p className="shipping_info_label">Country</p>
                  <p className="shipping_info_content mb-1">
                    {shippingData?.country || ""}
                  </p>
                </div>
              </div>

              {/* City, State, Address & ZIP */}
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:gap-4">
                <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                  <p className="shipping_info_label">City</p>
                  <p className="shipping_info_content mb-1">
                    {shippingData?.city || ""}
                  </p>
                </div>
                <div className="rounded-md bg-gray-50 p-2.5 sm:p-3">
                  <p className="shipping_info_label truncate">State</p>
                  <p className="shipping_info_content mb-1">
                    {shippingData?.state || ""}
                  </p>
                </div>
                <div className="col-span-2 rounded-md bg-gray-50 p-2.5 sm:col-span-1 sm:p-3">
                  <p className="shipping_info_label">Zip Code</p>
                  <p className="shipping_info_content mb-1">
                    {shippingData?.postalCode || ""}
                  </p>
                </div>
                <div className="col-span-2 rounded-md bg-gray-50 p-2.5 sm:col-span-1 sm:p-3">
                  <p className="shipping_info_label">House Address</p>
                  <p className="shipping_info_content mb-1">
                    {shippingData?.address || ""}
                  </p>
                </div>
              </div>
            </div>
          )}
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
