import { useQuery, UseQueryResult } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useTokenStore } from "@/src/features/auth/state/store";
import { getPostPerformance } from "../api/post-performance.api";
import { PostPerformanceResponseDto } from "../dto/post-performance.dto";
import {
  PostPerformance,
  PostPerformanceMeta,
} from "../types/post-performance.types";

interface UsePostPerformanceOptions {
  page?: number;
  limit?: number;
  enabled?: boolean;
}

interface PostPerformanceResult {
  posts: PostPerformance[];
  meta: PostPerformanceMeta;
}

export const usePostPerformance = (
  options: UsePostPerformanceOptions = {},
): UseQueryResult<PostPerformanceResult, Error> => {
  const { page = 1, limit = 10, enabled: customEnabled = true } = options;
  const { isAuthenticated, user, role } = useAuth();
  const token = useTokenStore((state) => state.accessToken);

  return useQuery<PostPerformanceResult, Error>({
    queryKey: ["postPerformance", user?.id, page, limit],
    queryFn: async () => {
      // Validation checks
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (!token) {
        throw new Error("No access token available");
      }

      if (role !== "ARTIST") {
        throw new Error("This feature is only available for artists");
      }

      console.log("🎨 Fetching post performance for artist:", user.id);

      // Fetch data with pagination
      const response = await getPostPerformance(user.id, page, limit);

      console.log("📊 Raw API Response:", response);

      // Validate response structure with Zod
      const validatedData = PostPerformanceResponseDto.parse(response);

      console.log("✅ Validated data:", validatedData);

      // Return both data and meta
      return {
        posts: validatedData.data,
        meta: validatedData.meta,
      };
    },
    enabled:
      isAuthenticated &&
      !!user?.id &&
      !!token &&
      role === "ARTIST" &&
      customEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};
