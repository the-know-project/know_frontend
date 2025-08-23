"use client";

import { NavbarButton } from "@/src/shared/ui/resizable-navbar";

const ArtSelectionSkeleton = () => {
  const predefinedWidths = [85, 70, 95, 80, 90, 75, 100, 65, 88, 92, 78, 82];

  return (
    <section className="relative flex w-full flex-col">
      <div className="z-50 grid w-full grid-cols-3 gap-x-3 gap-y-4 sm:grid-cols-4">
        {predefinedWidths.map((width, index) => (
          <div
            key={index}
            className="inline-flex w-fit animate-pulse rounded-md bg-gray-200 px-2 py-1 shadow-md"
            style={{
              animationDelay: `${index * 100}ms`,
            }}
          >
            <div
              className={`h-5 rounded bg-gray-300`}
              style={{
                width: `${width}px`,
              }}
            />
          </div>
        ))}
      </div>

      <NavbarButton
        colors={["#FF5733", "#33FF57", "#3357FF", "#F1C40F"]}
        className="mt-[150px] flex w-full items-center justify-center self-center"
      >
        <div className="relative inline-flex w-full animate-pulse items-center justify-center gap-1 self-center rounded-lg bg-gray-200 px-2.5 py-1.5">
          <div className="h-5 w-24 rounded bg-gray-300" />
          <div className="h-5 w-5 rounded bg-gray-300" />
        </div>
      </NavbarButton>
    </section>
  );
};

export default ArtSelectionSkeleton;
