"use client";
import { useStableAuthStatus } from "../../auth/hooks/use-stable-auth-status";
import ArtistProfileGrid from "../artist/components/artist-profile-grid";

export const ProfileGrid = () => {
  const { role, isLoading } = useStableAuthStatus({
    redirectOnExpiry: true,
    redirectTo: "/login",
  });

  // Always render the same component structure to maintain hook order
  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-pulse">
          <div className="h-4 w-32 rounded bg-gray-200"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      {role === "ARTIST" ? (
        <ArtistProfileGrid />
      ) : role === "BUYER" ? (
        <div>
          <p>Buyer profile grid should be implemented here</p>
        </div>
      ) : (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <p className="font-bricolage text-gray-500">
              Invalid user role or access denied
            </p>
          </div>
        </div>
      )}
    </>
  );
};
