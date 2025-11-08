"use client";

import { useQuery } from "@tanstack/react-query";

export interface BuyerProfile {
  name: string;
  role: string;
  location: string;
  profileImage: string;
  stats: {
    postViews: string;
    followers: string;
    following: string;
    likes: string;
  };
  bio: string;
  email: string;
  memberSince: string;
}

export const useFetchBuyerProfile = () => {
  return useQuery({
    queryKey: ["buyer-profile"],
    queryFn: async () => {
      const response = await fetch("/api/buyer/profile");
      
      if (!response.ok) {
        throw new Error("Failed to fetch buyer profile");
      }
      
      const data = await response.json();
      return data as BuyerProfile;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - profile data changes less frequently
    refetchOnWindowFocus: false,
  });
};
