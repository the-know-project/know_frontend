"use client";
import { useStableAuthStatus } from "../../auth/hooks/use-stable-auth-status";
import ArtistProfileGrid from "../artist/components/artist-profile-grid";

export const ProfileGrid = () => {
  const { role } = useStableAuthStatus({
    redirectOnExpiry: true,
    redirectTo: "/login",
  });

  return (
    <>
      {role === "ARTIST" ? (
        <ArtistProfileGrid />
      ) : (
        <div>
          <p>Buyer profile grid should be implemented here</p>
        </div>
      )}
    </>
  );
};
