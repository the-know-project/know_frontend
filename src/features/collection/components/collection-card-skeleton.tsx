const CollectionCardSkeleton = () => {
  return (
    <div className="mx-auto max-w-sm px-4 py-20 font-sans antialiased md:max-w-md">
      <div className="relative h-80 w-full overflow-visible">
        {/* Main Image Card Skeleton */}
        <div className="absolute inset-0 animate-pulse overflow-hidden rounded-3xl bg-neutral-800">
          {/* This div represents the image */}
          <div className="h-[300px] w-full bg-neutral-700"></div>
        </div>

        {/* Top-left icon skeleton */}
        <div className="absolute left-2 top-2 z-30 h-[40px] w-[40px] animate-pulse rounded-3xl bg-neutral-700/50 p-2 shadow-lg backdrop-blur-2xl"></div>

        {/* Top-right number skeleton */}
        <div className="absolute right-2 top-2 z-30 h-[40px] w-[40px] animate-pulse rounded-3xl bg-neutral-700/50 p-2 shadow-lg backdrop-blur-2xl"></div>

        {/* Bottom info skeleton */}
        <div className="group absolute bottom-7 z-30 w-full max-w-sm animate-pulse self-center rounded-3xl bg-neutral-700/50 px-4 py-2 shadow-lg backdrop-blur-2xl md:max-w-md">
          <div className="flex flex-row items-center justify-between">
            <div className="flex flex-col items-start gap-2 py-2">
              {/* Title skeleton */}
              <div className="h-4 w-24 rounded-md bg-neutral-600"></div>
              {/* Date skeleton */}
              <div className="h-3 w-32 rounded-md bg-neutral-600"></div>
            </div>

            {/* Arrow icon skeleton */}
            <div className="h-[40px] w-[40px] rounded-3xl border border-neutral-700 bg-neutral-600 p-2 shadow-lg backdrop-blur-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollectionCardSkeleton;
