import { useEffect, useRef, useCallback } from "react";

interface UseInfiniteScrollProps {
  /**
   * Function to call when threshold is reached
   */
  onLoadMore: () => void;
  /**
   * Whether more data can be loaded
   */
  hasNextPage: boolean;
  /**
   * Whether currently loading more data
   */
  isLoadingMore: boolean;
  /**
   * Distance from bottom to trigger load (in pixels)
   * @default 200
   */
  threshold?: number;
  /**
   * Target element to observe for scroll
   * If not provided, will use document
   */
  target?: React.RefObject<HTMLElement>;
  /**
   * Whether infinite scroll is enabled
   * @default true
   */
  enabled?: boolean;
}

export const useInfiniteScroll = ({
  onLoadMore,
  hasNextPage,
  isLoadingMore,
  threshold = 200,
  target,
  enabled = true,
}: UseInfiniteScrollProps) => {
  const loadingRef = useRef(false);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);

  const handleLoadMore = useCallback(() => {
    if (!enabled || !hasNextPage || isLoadingMore || loadingRef.current) {
      return;
    }

    loadingRef.current = true;
    onLoadMore();

    // Reset loading flag after a short delay
    setTimeout(() => {
      loadingRef.current = false;
    }, 100);
  }, [enabled, hasNextPage, isLoadingMore, onLoadMore]);

  // Scroll event handler for window/document
  const handleScroll = useCallback(() => {
    if (!enabled || !hasNextPage || isLoadingMore || loadingRef.current) {
      return;
    }

    const element = target?.current || document.documentElement;
    const { scrollTop, scrollHeight, clientHeight } = element;

    // Check if we're near the bottom
    if (scrollHeight - scrollTop - clientHeight < threshold) {
      handleLoadMore();
    }
  }, [enabled, hasNextPage, isLoadingMore, threshold, target, handleLoadMore]);

  useEffect(() => {
    if (!enabled || !sentinelRef.current) {
      return;
    }

    const sentinel = sentinelRef.current;

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting && hasNextPage && !isLoadingMore) {
          handleLoadMore();
        }
      },
      {
        root: target?.current || null,
        rootMargin: `${threshold}px`,
        threshold: 0.1,
      },
    );

    observerRef.current.observe(sentinel);

    return () => {
      if (observerRef.current && sentinel) {
        observerRef.current.unobserve(sentinel);
      }
    };
  }, [enabled, hasNextPage, isLoadingMore, threshold, target, handleLoadMore]);

  useEffect(() => {
    if (!enabled) {
      return;
    }

    const element = target?.current || window;

    element.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      element.removeEventListener("scroll", handleScroll);
    };
  }, [enabled, handleScroll, target]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return {
    /**
     * Ref to attach to a sentinel element at the bottom of your list
     * This element will trigger loading when it becomes visible
     */
    sentinelRef,
    /**
     * Manually trigger load more
     */
    loadMore: handleLoadMore,
  };
};
