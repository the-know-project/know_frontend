"use client";

import { useQuery } from "@tanstack/react-query";

interface EarningsDataPoint {
  month: string;
  earnings: number;
}

interface EarningsResponse {
  chartData: EarningsDataPoint[];
  total: number;
  percentageChange: number;
}

export const useFetchEarnings = () => {
  return useQuery<EarningsResponse>({
    queryKey: ["artist-earnings"],
    queryFn: async () => {
      const response = await fetch("/api/artist/earnings");

      if (!response.ok) {
        throw new Error("Failed to fetch earnings data");
      }

      const data = await response.json();
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};
