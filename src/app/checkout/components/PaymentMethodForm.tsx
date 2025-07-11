// app/checkout/components/PaymentMethodForm.tsx
"use client";

import { useRouter } from "next/navigation";
import { RadioGroup } from "@headlessui/react";
import { CreditCard, Banknote, Bitcoin } from "lucide-react";

const methods = [
  {
    value: "card",
    label: "Pay with debit card",
    icon: <CreditCard size={18} />,
  },
  {
    value: "transfer",
    label: "Pay with transfer",
    icon: <Banknote size={18} />,
  },
  { value: "crypto", label: "Pay with crypto", icon: <Bitcoin size={18} /> },
];

export const PaymentMethodForm = () => {
  const router = useRouter();
  const handleProceed = () => {
    router.push("/checkout/card-details");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-semibold">Choose a payment method</h2>
        <p className="text-sm text-gray-500">
          Choose your preferred payment method.
        </p>
      </div>
      <RadioGroup>
        <div className="space-y-4">
          {methods.map((method) => (
            <RadioGroup.Option
              key={method.value}
              value={method.value}
              className={({ checked }) =>
                `flex cursor-pointer items-center justify-between rounded-lg border px-4 py-3 ${
                  checked ? "border-orange-500" : "border-gray-300"
                }`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-4 w-4 rounded-full border-2 ${
                        checked
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-400"
                      }`}
                    />
                    <span>{method.label}</span>
                  </div>
                  {method.icon}
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>

      <button
        onClick={handleProceed}
        className="w-full rounded-lg cursor-pointer bg-blue-800 py-3 font-semibold text-white"
      >
        Proceed
      </button>
    </div>
  );
};
