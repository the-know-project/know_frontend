"use client";

import ExploreNav from "@/src/features/explore/components/explore-nav";
import { useFetchBuyerProfile } from "@/src/features/profile/hooks/use-fetch-buyer-profile";
import { MapPin } from "lucide-react";
import { useFollowArtist } from "@/src/features/profile/hooks/use-follow-artist";

export default function BuyerProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: userProfile, isLoading: profileLoading } = useFetchBuyerProfile();
  const followMutation = useFollowArtist();

  const handleFollow = () => {
    const artistId = "artist-id"; // Replace with actual artist ID
    followMutation.mutate(artistId);
  };

  return (
    <div className="flex min-h-screen flex-col bg-white">
      {/* Navigation */}
      <ExploreNav />

      {/* Main content with sidebar */}
      <main className="flex-1 mt-16">
        <div className="max-w-7xl mx-auto w-full px-6 py-8">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Left Sidebar - Profile (Sticky on desktop, top on mobile) */}
            <aside className="w-full lg:w-64 flex-shrink-0">
              <div className="lg:sticky lg:top-24">
                {profileLoading ? (
                  // Loading skeleton
                  <div className="animate-pulse">
                    <div className="w-20 h-20 rounded-full bg-gray-200 mb-4"></div>
                    <div className="h-6 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24 mb-4"></div>
                    <div className="h-10 bg-gray-200 rounded mb-6"></div>
                    <div className="space-y-3">
                      {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="h-4 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                ) : userProfile ? (
                  <>
                    {/* Profile Picture */}
                    <div className="mb-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-pink-400 to-red-500 flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center overflow-hidden">
                          <img
                            src={userProfile.profileImage}
                            alt={userProfile.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Name and Title */}
                    <div className="mb-4">
                      <h1 className="text-xl font-bold text-gray-900 mb-1">
                        {userProfile.name}
                      </h1>
                      <p className="text-sm text-gray-600">{userProfile.role}</p>
                    </div>

                    {/* Location */}
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                      <MapPin className="h-4 w-4" />
                      <span>{userProfile.location}</span>
                    </div>

                    {/* Follow Button */}
                    <button
                      onClick={handleFollow}
                      disabled={followMutation.isPending}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-4 rounded-md mb-6 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {followMutation.isPending ? "Following..." : "Follow"}
                    </button>

                    {/* Stats */}
                    <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Post Views</span>
                        <span className="font-semibold text-gray-900">
                          {userProfile.stats.postViews}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Followers</span>
                        <span className="font-semibold text-gray-900">
                          {userProfile.stats.followers}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Following</span>
                        <span className="font-semibold text-gray-900">
                          {userProfile.stats.following}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Likes</span>
                        <span className="font-semibold text-gray-900">
                          {userProfile.stats.likes}
                        </span>
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="mb-6">
                      <h3 className="text-xs font-semibold text-gray-500 uppercase mb-2">
                        Bio
                      </h3>
                      <p className="text-sm text-gray-700">{userProfile.bio}</p>
                    </div>

                    {/* Member Since */}
                    <div className="text-xs text-gray-500">
                      MEMBER SINCE {userProfile.memberSince}
                    </div>
                  </>
                ) : (
                  // Error state
                  <div className="text-center py-8">
                    <p className="text-red-500 text-sm mb-2">Failed to load profile</p>
                    <button
                      onClick={() => window.location.reload()}
                      className="text-xs text-blue-600 hover:text-blue-700"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 min-w-0">{children}</div>
          </div>
        </div>
      </main>
    </div>
  );
}
