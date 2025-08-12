import { cn } from "@/lib/utils";
import React from "react";

interface IGridBackground {
  children: React.ReactNode;
  className?: string;
  variant?: "default" | "dark" | "light";
}

const GridBackground: React.FC<IGridBackground> = ({
  children,
  className,
  variant = "default",
}) => {
  const getGridStyles = () => {
    switch (variant) {
      case "dark":
        return "[background-image:linear-gradient(to_right,#404040_1px,transparent_1px),linear-gradient(to_bottom,#404040_1px,transparent_1px)]";
      case "light":
        return "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]";
      default:
        return cn(
          "[background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)]",
          "dark:[background-image:linear-gradient(to_right,#404040_1px,transparent_1px),linear-gradient(to_bottom,#404040_1px,transparent_1px)]",
        );
    }
  };

  return (
    <div
      className={`relative flex h-fit w-full flex-col ${variant === "default" ? "bg-white dark:bg-black" : ""} ${className}`}
    >
      {/* Grid pattern background */}
      <div
        className={cn(
          "absolute inset-0 z-0",
          "[background-size:20px_20px]",
          getGridStyles(),
        )}
      />

      {/* Content container */}
      <div className="relative z-20">{children}</div>
    </div>
  );
};

export default GridBackground;
