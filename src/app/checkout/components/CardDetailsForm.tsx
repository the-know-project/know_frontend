"use client";

import { Input } from "../../../shared/ui/input";
import { Label } from "../../../shared/ui/label";
import { Button } from "../../../shared/ui/button";
import { HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";

export function CardDetailsForm() {
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/checkout/confirm"); // next step
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mx-auto max-w-xl space-y-6 px-4 py-8 sm:px-0"
    >
      {/* Heading */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Input payment details
        </h2>
        <p className="text-sm text-gray-500">
          Enter the exact details as they appear on your card.
        </p>
      </div>

      {/* Card Number */}
      <div className="space-y-1">
        <Label htmlFor="card-number">Card Number</Label>
        <Input
          id="card-number"
          name="cardNumber"
          type="text"
          inputMode="numeric"
          placeholder="0000 0000 0000 0000"
          className="tracking-widest"
          required
        />
      </div>

      {/* Expiry + CVV */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="space-y-1">
          <Label htmlFor="expiry">Expiration Date</Label>
          <Input
            id="expiry"
            name="expiry"
            type="text"
            placeholder="MM/YY"
            required
          />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Label htmlFor="cvv">Security Code</Label>
            <HelpCircle className="h-4 w-4 text-gray-400" />
          </div>
          <Input
            id="cvv"
            name="cvv"
            type="text"
            inputMode="numeric"
            placeholder="CVV"
            required
          />
        </div>
      </div>

      {/* Proceed Button */}
      <div className="pt-4">
        <Button
          type="submit"
          className="font-bricolage relative mt-5 inline-flex cursor-pointer w-full items-center gap-[8px] rounded-lg bg-[#1E3A8A] pt-[12px] pr-[8px] pb-[12px] pl-[12px] text-sm font-medium text-white outline outline-[#fff2f21f] transition-all duration-200 hover:scale-105 active:scale-95"
        >
          Proceed
        </Button>
      </div>
    </form>
  );
}


