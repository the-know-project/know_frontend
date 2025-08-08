const ProfileCardSkeletonGrid = () => (
  <div className="flex w-full flex-col items-center gap-4 lg:grid lg:grid-cols-2 lg:items-start lg:gap-6">
    {Array.from({ length: 8 }).map((_, index) => (
      <div
        key={index}
        className="mt-[30px] flex w-full animate-pulse flex-col px-4"
      >
        <div className="flex flex-col">
          {/* Image skeleton */}
          <div className="aspect-[4/3] w-full rounded-[15px] bg-gray-300"></div>

          {/* Content skeleton */}
          <div className="mt-2 flex w-full max-w-[400px] justify-between">
            <div className="flex flex-col items-start gap-1">
              {/* Title skeleton */}
              <div className="h-4 w-24 rounded bg-gray-300"></div>
              {/* Date skeleton */}
              <div className="h-3 w-16 rounded bg-gray-300"></div>
            </div>

            <div className="flex items-center gap-3">
              {/* Eye icon + views skeleton */}
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 rounded bg-gray-300"></div>
                <div className="h-3 w-8 rounded bg-gray-300"></div>
              </div>
              {/* Edit icon + text skeleton */}
              <div className="flex items-center gap-1">
                <div className="h-4 w-4 rounded bg-gray-300"></div>
                <div className="h-3 w-6 rounded bg-gray-300"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    ))}
  </div>
);

export default ProfileCardSkeletonGrid;
