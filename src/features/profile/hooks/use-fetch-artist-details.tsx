"use client";

import { useQuery } from "@tanstack/react-query";
import { fetchArtistDetails } from "../api/route";

export const useFetchArtistDetails = (artistId: string) => {
  return useQuery({
    queryKey: ["artist-details", artistId],
    queryFn: () => fetchArtistDetails(artistId),
    enabled: !!artistId,
  });
};
