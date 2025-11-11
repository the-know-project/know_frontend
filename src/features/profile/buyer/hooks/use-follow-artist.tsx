"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useFollowArtist = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (artistId: string) => {
      const response = await fetch("/api/buyer/follow", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ artistId }),
      });

      if (!response.ok) {
        throw new Error("Failed to follow artist");
      }

      return response.json();
    },
    onSuccess: () => {
      // Invalidate and refetch profile to update follower count
      queryClient.invalidateQueries({ queryKey: ["buyer-profile"] });
    },
  });
};
