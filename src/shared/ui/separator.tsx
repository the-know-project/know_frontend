import * as React from "react";
import { cn } from "@/lib/utils";

const Separator = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "h-[1px] w-full shrink-0 bg-neutral-200 dark:bg-neutral-800",
      className,
    )}
    {...props}
  />
));
Separator.displayName = "Separator";

export { Separator };
