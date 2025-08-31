"use client";
import { useOptimizedAuth } from "../../auth/hooks/use-optimized-auth";
import { IUser } from "../../auth/state/interface/auth.interface";
import ArtistProfileGrid from "../artist/components/artist-profile-grid";

export const ProfileGrid = () => {
  const { canRender, user, isLoading, role } = useOptimizedAuth();

  if (isLoading && !canRender) {
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
        <ArtistProfileGrid user={user as IUser} />
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
