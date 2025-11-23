// src/features/profile/artist/api/post-performance.api.ts
import { ApiClient, httpClient } from "@/src/lib/api-client";
import { PostPerformanceResponse } from "../dto/post-performance.dto";

export const getPostPerformance = async (
  userId: string,
  page: number = 1,
  limit: number = 10
): Promise<PostPerformanceResponse> => {
  
  // Debug logging
  console.log('📊 Fetching Post Performance:', {
    userId,
    page,
    limit,
    baseURL: httpClient.getBaseURL(),
  });
  
  try {
    const response = await ApiClient.get<PostPerformanceResponse>(
      '/api/metrics/postPerformance',
      {
        params: {
          userId,
          page,
          limit,
        },
      }
    );
    
    console.log('✅ Post Performance Response:', response);
    return response;
    
  } catch (error: any) {
    console.error('❌ Post Performance API Error:', {
      status: error?.response?.status,
      url: error?.config?.url,
      baseURL: httpClient.getBaseURL(),
    });
    
    throw error;
  }
};