// src/features/profile/artist/hooks/use-post-performance.ts
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/src/features/auth/hooks/use-auth";
import { useTokenStore } from "@/src/features/auth/state/store";
import { getPostPerformance } from "../api/post-performance.api";
import { PostPerformanceResponseDto } from "../dto/post-performance.dto";
import { PostPerformance } from "../types/post-performance.types";

export const usePostPerformance = () => {
  const { isAuthenticated, user, role } = useAuth();
  const token = useTokenStore((state) => state.accessToken);

  return useQuery<PostPerformance[]>({
    queryKey: ["postPerformance", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        throw new Error("User not authenticated");
      }

      if (!token) {
        throw new Error("No access token available");
      }

      if (role !== "ARTIST") {
        throw new Error("This feature is only available for artists");
      }

      const response = await getPostPerformance(user.id);

      // DEBUG: Log the actual response to see the structure
      console.log("📊 Raw API Response:", response);
      console.log("📊 Response data array:", response.data);
      if (response.data && response.data.length > 0) {
        console.log("📊 First item structure:", response.data[0]);
        console.log("📊 First item keys:", Object.keys(response.data[0]));
      }

      const validatedData = PostPerformanceResponseDto.parse(response);
      return validatedData.data;
    },
    enabled: isAuthenticated && !!user?.id && !!token && role === "ARTIST",
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
    retry: false,
  });
};
