// src/features/profile/artist/api/post-performance.api.ts
import { ApiClient } from "@/src/lib/api-client";
import { PostPerformanceResponse } from "../types/post-performance.types";

export const getPostPerformance = async (userId: string): Promise<PostPerformanceResponse> => {
  return await ApiClient.get(`/api/metrics/postPerformance?userId=${userId}`);
};