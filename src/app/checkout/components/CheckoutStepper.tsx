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
    <div className="scrollbar-hide mb-3 overflow-x-auto sm:mb-4 md:mb-6">
      <div className="flex min-w-max items-center justify-between gap-0.5 px-3 py-2 sm:min-w-0 sm:gap-1 sm:px-6 sm:py-0 md:gap-2 md:px-0">
        {checkoutSteps.map((step, index) => (
          <div
            key={step.path}
            className="flex items-center gap-1 sm:gap-1.5 md:gap-2"
          >
            {/* Step Indicator Dot */}
            <div
              className={clsx(
                "h-2 w-2 flex-shrink-0 rounded-full transition-colors sm:h-2.5 sm:w-2.5 md:h-3 md:w-3",
                index <= activeIndex ? "bg-orange-500" : "bg-gray-300",
              )}
            />

            {/* Step Label */}
            <span
              className={clsx(
                "text-[10px] whitespace-nowrap transition-colors sm:text-xs md:text-sm",
                index <= activeIndex
                  ? "font-semibold text-black"
                  : "font-medium text-gray-400",
              )}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index !== checkoutSteps.length - 1 && (
              <div className="mx-0.5 h-px w-2 flex-shrink-0 bg-gray-300 sm:mx-1 sm:w-4 md:mx-2 md:w-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
