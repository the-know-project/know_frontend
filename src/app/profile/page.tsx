"use client";

import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import EditProfilePage from "@/src/features/edit-profile/component/edit-page";
import { useUpdateProfile } from "@/src/features/edit-profile/hooks/use-update-profile";
import { getUserProfile } from "@/src/lib/profile-api";
import { useTokenStore } from "@/src/features/auth/state/store";
import {
  selectUserId,
  selectUser,
} from "@/src/features/auth/state/selectors/token.selectors";
import toast, { Toaster } from "react-hot-toast";

export default function EditProfile() {
  const router = useRouter();
  const userId = useTokenStore(selectUserId);
  const user = useTokenStore(selectUser);
  const { mutateAsync: updateProfile, isPending } = useUpdateProfile();

  // Fetch current profile data
  const {
    data: profileData,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-profile", userId],
    queryFn: async () => {
      if (!userId) throw new Error("User not authenticated");
      const response = await getUserProfile(userId);
      return response.data;
    },
    enabled: !!userId,
    staleTime: 0, // Always fetch fresh data
    refetchOnMount: true, // Refetch when component mounts
  });

  const handleSave = async (data: any) => {
    try {
      console.log("💾 Saving profile changes...");

      // Call the mutation
      await updateProfile(data);

      // Show success message
      toast.success("Profile updated successfully! 🎉", {
        duration: 3000,
        position: "top-right",
        style: {
          background: "#10B981",
          color: "#fff",
        },
      });

      // Wait a bit for user to see the message
      setTimeout(() => {
        console.log("✅ Redirecting to profile page...");
        // Navigate back to profile page
        router.push("/profile");
      }, 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile. Please try again.", {
        duration: 4000,
        position: "top-right",
        style: {
          background: "#EF4444",
          color: "#fff",
        },
      });
    }
  };

  const handleCancel = () => {
    router.back();
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
          <p className="text-gray-600">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error || !profileData) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#FAFAFA]">
        <div className="text-center">
          <p className="mb-4 text-red-600">Failed to load profile</p>
          <button
            onClick={() => router.push("/profile")}
            className="rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Back to Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Toaster />
      <EditProfilePage
        userType={user?.userType || profileData?.userSelection || "client"}
        initialData={profileData}
        onSave={handleSave}
        onCancel={handleCancel}
        isLoading={isPending}
      />
    </>
  );
}
