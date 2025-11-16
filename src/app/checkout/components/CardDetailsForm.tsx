"use client";
import { Input } from "@/src/shared/ui/input";
import { Label } from "@/src/shared/ui/label";
import { Button } from "@/src/shared/ui/button";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function CardDetailsForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/checkout/shipping");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto w-full max-w-xl space-y-5 px-3 py-4 sm:space-y-6 sm:px-6 sm:py-8 md:px-0"
    >
      {/* Heading */}
      <div className="space-y-1">
        <h2 className="text-[15px] leading-tight font-semibold text-gray-900 sm:text-base md:text-lg">
          Input payment details
        </h2>
        <p className="text-[11px] leading-snug text-gray-500 sm:text-xs md:text-sm">
          Enter the exact details as they appear on your card.
        </p>
      </div>

      {/* Card Number */}
      <div className="space-y-1.5">
        <Label
          htmlFor="card-number"
          className="text-[12px] font-medium sm:text-xs md:text-sm"
        >
          Card Number
        </Label>
        <Input
          id="card-number"
          name="cardNumber"
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          className="h-11 text-[13px] tracking-widest placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
          required
        />
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-3 md:gap-4">
        <div className="space-y-1.5">
          <Label
            htmlFor="expiry"
            className="text-[12px] font-medium sm:text-xs md:text-sm"
          >
            Expiration Date
          </Label>
          <Input
            id="expiry"
            name="expiry"
            type="text"
            placeholder="MM/YY"
            className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
            required
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center gap-1">
            <Label
              htmlFor="cvv"
              className="text-[12px] font-medium sm:text-xs md:text-sm"
            >
              Security Code
            </Label>
            <HelpCircle className="h-3 w-3 flex-shrink-0 text-gray-400 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
          </div>
          <Input
            id="cvv"
            name="cvv"
            type="text"
            inputMode="numeric"
            placeholder="CVV"
            className="h-11 text-[13px] placeholder:text-[12px] sm:h-10 sm:text-sm md:h-11 md:text-base"
            required
          />
        </div>
      </div>

      {/* Security Badge (Optional visual trust element) */}
      <div className="flex items-center justify-center gap-1.5 rounded-md bg-blue-50 py-2 sm:py-2.5">
        <svg
          className="h-4 w-4 text-blue-600 sm:h-4.5 sm:w-4.5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
          />
        </svg>
        <p className="text-[11px] font-medium text-blue-700 sm:text-xs">
          Your payment information is secure
        </p>
      </div>

      {/* Proceed Button */}
      <div className="pt-2 sm:pt-3 md:pt-4">
        <Button
          type="submit"
          className="font-bricolage relative inline-flex min-h-[48px] w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-[#1E3A8A] px-4 text-[14px] font-semibold text-white outline outline-[#fff2f21f] transition-transform duration-200 hover:bg-[#1a3474] active:scale-98 sm:min-h-[44px] sm:text-sm md:min-h-[48px] md:text-base"
        >
          Proceed
        </Button>
      </div>

      {/* Payment Methods Icons (Optional) */}
      <div className="flex items-center justify-center gap-2 pt-2 sm:gap-3 sm:pt-3">
        <p className="text-[10px] text-gray-400 sm:text-xs">We accept:</p>
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Visa */}
          <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white sm:h-7 sm:w-10">
            <span className="text-[10px] font-bold text-blue-700 sm:text-xs">
              VISA
            </span>
          </div>
          {/* Mastercard */}
          <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white sm:h-7 sm:w-10">
            <div className="flex gap-0.5">
              <div className="h-3 w-3 rounded-full bg-red-500 opacity-80 sm:h-3.5 sm:w-3.5"></div>
              <div className="-ml-1.5 h-3 w-3 rounded-full bg-orange-500 opacity-80 sm:h-3.5 sm:w-3.5"></div>
            </div>
          </div>
          {/* Verve */}
          <div className="flex h-6 w-9 items-center justify-center rounded border border-gray-200 bg-white sm:h-7 sm:w-10">
            <span className="text-[9px] font-bold text-teal-600 sm:text-[10px]">
              VERVE
            </span>
          </div>
        </div>
      </div>
    </form>
  );
}
