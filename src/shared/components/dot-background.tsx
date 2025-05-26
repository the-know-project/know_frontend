import { cn } from "@/lib/utils";
import React from "react";

interface IDotBackground {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "light";
}

const DotBackground: React.FC<IDotBackground> = ({
  children,
  className,
  variant,
}) => {
  return (
    <div
      className={`relative flex h-fit w-full flex-col ${variant === "default" ? "bg-white dark:bg-black" : ""} ${className}`}
    >
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}

      {children}
    </div>
  );
};

export default DotBackground;
