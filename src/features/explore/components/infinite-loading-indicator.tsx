import { IconLoader2 } from "@tabler/icons-react";

interface InfiniteLoadingIndicatorProps {
  isVisible?: boolean;
  text?: string;
  className?: string;
}

const InfiniteLoadingIndicator: React.FC<InfiniteLoadingIndicatorProps> = ({
  isVisible = true,
  className = "",
}) => {
  if (!isVisible) {
    return null;
  }

  return (
    <div
      className={`flex w-full items-center justify-center py-8 ${className}`}
    >
      <div className="flex items-center gap-3">
        <IconLoader2
          width={20}
          height={20}
          className="animate-spin text-gray-500"
        />
      </div>
    </div>
  );
};

export default InfiniteLoadingIndicator;
