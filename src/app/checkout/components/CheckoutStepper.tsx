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
    <div className="mb-4 sm:mb-6">
      {/* Mobile view - stacked vertical stepper */}
      <div className="flex sm:hidden">
        {checkoutSteps.map((step, index) => (
          <div key={step.path} className="flex flex-1 flex-col items-center">
            {/* Top row: dots and lines */}
            <div className="relative flex w-full items-center justify-center">
              {/* Left connector */}
              {index !== 0 && (
                <div
                  className={clsx(
                    "absolute right-1/2 h-0.5 w-1/2",
                    index <= activeIndex ? "bg-orange-500" : "bg-gray-300",
                  )}
                />
              )}

              {/* Dot */}
              <div
                className={clsx(
                  "relative z-10 h-3 w-3 flex-shrink-0 rounded-full",
                  index <= activeIndex ? "bg-orange-500" : "bg-gray-300",
                )}
              />

              {/* Right connector */}
              {index !== checkoutSteps.length - 1 && (
                <div
                  className={clsx(
                    "absolute left-1/2 h-0.5 w-1/2",
                    index < activeIndex ? "bg-orange-500" : "bg-gray-300",
                  )}
                />
              )}
            </div>

            {/* Label below dot */}
            <span
              className={clsx(
                "mt-1.5 text-center text-[10px] leading-tight",
                index <= activeIndex
                  ? "font-semibold text-black"
                  : "font-medium text-gray-400",
              )}
            >
              {step.label}
            </span>
          </div>
        ))}
      </div>

      {/* Desktop view - horizontal stepper */}
      <div className="hidden items-center justify-between sm:flex">
        {checkoutSteps.map((step, index) => (
          <div key={step.path} className="flex items-center gap-1.5 md:gap-2">
            {/* Step Indicator Dot */}
            <div
              className={clsx(
                "h-2.5 w-2.5 flex-shrink-0 rounded-full transition-colors md:h-3 md:w-3",
                index <= activeIndex ? "bg-orange-500" : "bg-gray-300",
              )}
            />

            {/* Step Label */}
            <span
              className={clsx(
                "text-xs whitespace-nowrap transition-colors md:text-sm",
                index <= activeIndex
                  ? "font-semibold text-black"
                  : "font-medium text-gray-400",
              )}
            >
              {step.label}
            </span>

            {/* Connector Line */}
            {index !== checkoutSteps.length - 1 && (
              <div className="mx-1 h-px w-4 flex-shrink-0 bg-gray-300 md:mx-2 md:w-8" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
