import { TAsset } from "../types/explore.types";

/**
 * Utility functions for managing infinite loading state and operations
 */

/**
 * Removes duplicate assets based on fileId
 * @param assets - Array of assets to deduplicate
 * @returns Deduplicated array of assets
 */
export const deduplicateAssets = (assets: TAsset[]): TAsset[] => {
  const seen = new Set<string>();
  return assets.filter((asset) => {
    if (seen.has(asset.fileId)) {
      return false;
    }
    seen.add(asset.fileId);
    return true;
  });
};

/**
 * Merges new assets with existing assets, removing duplicates
 * @param existingAssets - Current assets in the store
 * @param newAssets - New assets to merge
 * @returns Merged and deduplicated array of assets
 */
export const mergeAssets = (
  existingAssets: TAsset[],
  newAssets: TAsset[],
): TAsset[] => {
  const combined = [...existingAssets, ...newAssets];
  return deduplicateAssets(combined);
};

/**
 * Calculates if there are more pages based on current page and total pages
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @returns Whether there are more pages to load
 */
export const hasMorePages = (
  currentPage: number,
  totalPages: number,
): boolean => {
  return currentPage < totalPages;
};

/**
 * Calculates the next page number
 * @param currentPage - Current page number
 * @param totalPages - Total number of pages
 * @returns Next page number or null if no more pages
 */
export const getNextPage = (
  currentPage: number,
  totalPages: number,
): number | null => {
  return hasMorePages(currentPage, totalPages) ? currentPage + 1 : null;
};

/**
 * Checks if filters have changed by comparing their JSON representations
 * @param oldFilters - Previous filters object
 * @param newFilters - New filters object
 * @returns Whether filters have changed
 */
export const filtersChanged = (oldFilters: any, newFilters: any): boolean => {
  return JSON.stringify(oldFilters) !== JSON.stringify(newFilters);
};

/**
 * Debounces a function to prevent rapid successive calls
 * @param func - Function to debounce
 * @param wait - Wait time in milliseconds
 * @returns Debounced function
 */
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

/**
 * Throttles a function to limit how often it can be called
 * @param func - Function to throttle
 * @param limit - Time limit in milliseconds
 * @returns Throttled function
 */
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  limit: number,
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

/**
 * Calculates the scroll progress as a percentage
 * @param element - Element to calculate scroll progress for (defaults to document)
 * @returns Scroll progress as a percentage (0-100)
 */
export const getScrollProgress = (element?: HTMLElement): number => {
  const target = element || document.documentElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  if (scrollHeight <= clientHeight) {
    return 100; // If content doesn't scroll, consider it fully scrolled
  }

  const scrollable = scrollHeight - clientHeight;
  return (scrollTop / scrollable) * 100;
};

/**
 * Checks if an element is near the bottom of its scroll container
 * @param element - Element to check (defaults to document)
 * @param threshold - Distance from bottom in pixels (default: 200)
 * @returns Whether the element is near the bottom
 */
export const isNearBottom = (
  element?: HTMLElement,
  threshold: number = 200,
): boolean => {
  const target = element || document.documentElement;
  const { scrollTop, scrollHeight, clientHeight } = target;

  return scrollHeight - scrollTop - clientHeight < threshold;
};

/**
 * Smoothly scrolls to the top of the page or element
 * @param element - Element to scroll (defaults to window)
 * @param behavior - Scroll behavior ('smooth' or 'auto')
 */
export const scrollToTop = (
  element?: HTMLElement,
  behavior: ScrollBehavior = "smooth",
): void => {
  if (element) {
    element.scrollTo({ top: 0, behavior });
  } else {
    window.scrollTo({ top: 0, behavior });
  }
};

/**
 * Formats loading states for UI display
 */
export const getLoadingMessage = (
  isInitialLoading: boolean,
  isLoadingMore: boolean,
  hasError: boolean,
  isEmpty: boolean,
): string => {
  if (hasError) return "Failed to load content";
  if (isInitialLoading) return "Loading...";
  if (isLoadingMore) return "Loading more...";
  if (isEmpty) return "No content available";
  return "";
};

/**
 * Creates a delay for async operations (useful for testing or UX)
 * @param ms - Milliseconds to delay
 * @returns Promise that resolves after the delay
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};
