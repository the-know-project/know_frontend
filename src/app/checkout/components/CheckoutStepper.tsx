// app/checkout/components/CheckoutStepper.tsx
"use client";

import { checkoutSteps } from "../checkoutSteps";
import { usePathname } from "next/navigation";
import clsx from "clsx";

export const CheckoutStepper = () => {
  const pathname = usePathname();
  const activeIndex = checkoutSteps.findIndex((step) =>
    pathname.includes(step.path),
  );

  return (
    <div className="mb-6 flex items-center justify-between">
      {checkoutSteps.map((step, index) => (
        <div key={step.path} className="flex items-center gap-2">
          <div
            className={clsx(
              "h-3 w-3 rounded-full",
              index <= activeIndex ? "bg-orange-500" : "bg-gray-300",
            )}
          />
          <span
            className={clsx(
              "text-sm",
              index <= activeIndex
                ? "font-semibold text-black"
                : "text-gray-400",
            )}
          >
            {step.label}
          </span>
          {index !== checkoutSteps.length - 1 && (
            <div className="mx-2 h-px w-8 bg-gray-300" />
          )}
        </div>
      ))}
    </div>
  );
};
