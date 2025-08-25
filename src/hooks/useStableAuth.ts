import { useEffect, useState } from "react";
import { useTokenStore } from "../features/auth/state/store";

/**
 * Hook to determine if authentication state is stable and ready for data fetching.
 * This prevents components from crashing during page refresh when auth state is transitioning.
 *
 * Auth is considered stable when:
 * 1. The store has finished hydrating from localStorage
 * 2. Either we have a valid authenticated state with token, or we're confirmed unauthenticated
 */
export const useStableAuth = () => {
  const { hasHydrated, isAuthenticated, accessToken } = useTokenStore();

  const isStable = hasHydrated && (isAuthenticated ? !!accessToken : true);

  return {
    isStable,
    isAuthenticated: isAuthenticated && !!accessToken,
    hasHydrated,
  };
};

/**
 * Hook for components that need to fetch data only when auth is stable.
 * Returns a boolean indicating whether it's safe to make authenticated API calls.
 */
export const useCanFetchData = () => {
  const { isStable, isAuthenticated } = useStableAuth();

  return isStable;
};

/**
 * Hook that provides a stable authentication state with loading indicator.
 * Useful for components that need to show loading while auth state stabilizes.
 */
export const useAuthWithLoading = () => {
  const { hasHydrated, isAuthenticated, accessToken } = useTokenStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (hasHydrated) {
      const timer = setTimeout(() => setIsLoading(false), 100);
      return () => clearTimeout(timer);
    }
  }, [hasHydrated]);

  return {
    isLoading: isLoading || !hasHydrated,
    isAuthenticated: isAuthenticated && !!accessToken,
    user: useTokenStore.getState().getUser(),
  };
};
