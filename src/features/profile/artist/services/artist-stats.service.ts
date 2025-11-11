import { ApiClient } from "@/src/lib/api-client";

export interface IUserMetrics {
  totalViews: number;
  totalLikes: number;
  totalSales: number;
  totalRevenue: number;
  followersCount: number;
  followingCount: number;
  chartData?: {
    month: string;
    views: number;
    sales: number;
    revenue: number;
  }[];
  percentageChange?: number;
}

export interface IFollower {
  id: string;
  username: string;
  email: string;
  imageUrl: string;
  followedAt: string;
}

export interface IFollowersResponse {
  status: number;
  message: string;
  data: IFollower[];
}

export interface IFollowingResponse {
  status: number;
  message: string;
  data: IFollower[];
}

export const artistStatsService = {
  // Get user metrics for chart - accepts 'monthly' or 'yearly'
  getUserMetrics: async (userId: string, period: 'monthly' | 'yearly' = 'yearly') => {
    return await ApiClient.get<IUserMetrics>(`/api/metrics/userMetrics`, {
      params: { 
        userId,
        period // 'monthly' or 'yearly'
      }
    });
  },

  // Get user followers
  getUserFollowers: async (userId: string) => {
    return await ApiClient.get<IFollowersResponse>('/api/metrics/fetchUserFollowers', {
      params: { userId }
    });
  },

  // Get user following
  getUserFollowing: async (userId: string) => {
    return await ApiClient.get<IFollowingResponse>('/api/metrics/fetchUserFollowing', {
      params: { userId }
    });
  },

  // Unfollow a user
  unfollowUser: async (userId: string, targetUserId: string) => {
    return await ApiClient.post('/api/metrics/unfollowUser', {
      userId,
      targetUserId
    });
  },
};