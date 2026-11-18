import { BlankProfilePicture } from "@/src/constants/constants";
import { useFetchProfileDetails } from "@/src/features/profile/hooks/use-fetch-profile-details";

interface UseArtistInfoOptions {
  artistId: string;
  fallbackName?: string;
  fallbackImage?: string;
}

export const useArtistInfo = ({
  artistId,
  fallbackName,
  fallbackImage,
}: UseArtistInfoOptions) => {
  const profileQuery = useFetchProfileDetails({ userId: artistId });
  const profile = profileQuery.data?.data;
  const name = profile
    ? `${profile.firstName} ${profile.lastName}`.trim()
    : fallbackName?.trim() || "Know creator";

  return {
    name,
    imageUrl: profile?.imageUrl || fallbackImage || BlankProfilePicture,
    country: profile?.country || null,
    hasProfile: !!profile || !!fallbackName,
    isLoading: profileQuery.isLoading && !fallbackName,
    isError: profileQuery.isError,
    refetch: profileQuery.refetch,
  };
};
