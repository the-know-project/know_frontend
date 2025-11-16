"use client";
import { RadioGroup } from "@headlessui/react";
import { Banknote, Bitcoin, CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";

const methods = [
  {
    value: "card",
    label: "Pay with debit card",
    icon: <CreditCard size={16} className="sm:h-[18px] sm:w-[18px]" />,
  },
  {
    value: "transfer",
    label: "Pay with transfer",
    icon: <Banknote size={16} className="sm:h-[18px] sm:w-[18px]" />,
  },
  {
    value: "crypto",
    label: "Pay with crypto",
    icon: <Bitcoin size={16} className="sm:h-[18px] sm:w-[18px]" />,
  },
];

export const PaymentMethodForm = () => {
  const router = useRouter();

  const handleProceed = () => {
    router.push("/checkout/card-details");
  };

  return (
    <div className="mx-auto max-w-xl space-y-4 px-4 py-6 sm:space-y-6 sm:px-0 sm:py-8">
      <div>
        <h2 className="text-base font-semibold sm:text-lg">
          Choose a payment method
        </h2>
        <p className="text-xs text-gray-500 sm:text-sm">
          Choose your preferred payment method.
        </p>
      </div>

      <RadioGroup>
        <div className="space-y-3 sm:space-y-4">
          {methods.map((method) => (
            <RadioGroup.Option
              key={method.value}
              value={method.value}
              className={({ checked }) =>
                `flex cursor-pointer items-center justify-between rounded-lg border px-3 py-2.5 sm:px-4 sm:py-3 ${
                  checked ? "border-orange-500" : "border-gray-300"
                }`
              }
            >
              {({ checked }) => (
                <>
                  <div className="flex items-center gap-2">
                    <div
                      className={`h-3.5 w-3.5 flex-shrink-0 rounded-full border-2 sm:h-4 sm:w-4 ${
                        checked
                          ? "border-orange-500 bg-orange-500"
                          : "border-gray-400"
                      }`}
                    />
                    <span className="text-xs sm:text-sm">{method.label}</span>
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
        className="w-full cursor-pointer rounded-lg bg-blue-800 py-2.5 text-sm font-semibold text-white sm:py-3 sm:text-base"
      >
        Proceed
      </button>
    </div>
  );
};
