const ExploreCardSkeleton: React.FC = () => {
  return (
    <div className="flex h-[300px] w-full max-w-[500px] flex-col items-center justify-center gap-2 rounded-[15px] px-6 py-3">
      <div className="flex w-full flex-col rounded-[15px] shadow-sm">
        <div className="h-[220px] w-full animate-pulse rounded-[15px] bg-gray-200" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="explore_logo_wrapper">
            <div className="h-[30px] w-[30px] animate-pulse rounded-full bg-gray-200" />
          </div>

          <div className="flex flex-col items-start gap-1">
            <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
            <div className="h-4 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        </div>

        <div className="explore_logo_wrapper flex items-center gap-2">
          <div className="h-[30px] w-[30px] animate-pulse rounded bg-gray-200" />
          <div className="h-4 w-6 animate-pulse rounded bg-gray-200" />
        </div>
      </div>
    </div>
  );
};

interface ExploreCardSkeletonGridProps {
  count?: number;
}

const ExploreCardSkeletonGrid: React.FC<ExploreCardSkeletonGridProps> = ({
  count = 6,
}) => {
  return (
    <div className="grid w-full grid-cols-1 gap-4 self-center md:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: count }).map((_, index) => (
        <ExploreCardSkeleton key={index} />
      ))}
    </div>
  );
};

export default ExploreCardSkeleton;
export { ExploreCardSkeletonGrid };
