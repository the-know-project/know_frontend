import { cn } from "@/lib/utils";
import React from "react";

interface IDotBackground {
  children: React.ReactNode;
}

const DotBackground: React.FC<IDotBackground> = ({ children }) => {
  return (
    <div className="relative flex h-fit w-full flex-col bg-white dark:bg-black">
      <div
        className={cn(
          "absolute inset-0",
          "[background-size:20px_20px]",
          "[background-image:radial-gradient(#d4d4d4_1px,transparent_1px)]",
          "dark:[background-image:radial-gradient(#404040_1px,transparent_1px)]",
        )}
      />
      {/* Radial gradient for the container to give a faded look */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center bg-white [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)] dark:bg-black"></div>
      {children}
    </div>
  );
};

export default DotBackground;
