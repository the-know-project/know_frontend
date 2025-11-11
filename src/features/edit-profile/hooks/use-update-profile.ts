// src/lib/hooks/use-update-profile.ts
// React Query hook for updating profile with optimistic updates

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "@/src/features/auth/state/store";
import { updateProfile, updateProfileImage, UpdateProfileRequest, UserProfile } from "@/src/lib/profile-api";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";

export interface ProfileError extends Error {
  field?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationKey: ['update-profile', userId],
    
    mutationFn: async (data: UpdateProfileRequest & { profileImage?: File }) => {
      if (!userId) {
        throw new Error('User ID is required to update profile');
      }

      console.log('📝 Updating profile:', data);

      // Separate image upload from profile data
      const { profileImage, ...profileData } = data;

      // Update profile data
      try {
        const profileResponse = await updateProfile({ ...profileData, userId });
        console.log('✅ Profile update response:', profileResponse);

        // Upload profile image if provided
        if (profileImage) {
          try {
            const imageResponse = await updateProfileImage(userId, profileImage);
            console.log('✅ Image upload response:', imageResponse);
            
            // Return combined response with new image URL
            return {
              ...profileResponse,
              data: {
                ...profileResponse.data,
                profileImage: imageResponse.data.profileImage
              }
            };
          } catch (imageError) {
            // Profile was updated but image failed - log warning but don't throw
            console.warn('⚠️ Profile updated but image upload failed:', imageError);
          }
        }

        console.log('✅ Profile updated successfully');
        return profileResponse;
      } catch (error) {
        console.error('❌ Failed to update profile:', error);
        throw error;
      }
    },

    // Optimistic update - Update UI immediately
    onMutate: async (data) => {
      if (!userId) return;

      console.log('⚡ Optimistic update: Updating profile');

      // Cancel outgoing queries to avoid race conditions
      await queryClient.cancelQueries({
        queryKey: ['user-profile', userId],
      });

      // Snapshot previous value for rollback
      const previousProfile = queryClient.getQueryData(['user-profile', userId]);

      // Optimistically update cache
      queryClient.setQueryData(['user-profile', userId], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          data: {
            ...old.data,
            ...data,
            // Create preview URL for image if uploading
            profileImage: data.profileImage 
              ? URL.createObjectURL(data.profileImage) 
              : old.data?.profileImage,
          },
        };
      });

      return { previousProfile };
    },

    // Rollback on error
    onError: (error, data, context) => {
      console.error('❌ Failed to update profile:', error);

      if (context?.previousProfile && userId) {
        console.log('↩️ Rolling back optimistic update');
        queryClient.setQueryData(['user-profile', userId], context.previousProfile);
      }
    },

    // Always refetch after success or error to sync with server
    onSettled: () => {
      if (userId) {
        console.log('🔄 Invalidating profile queries to refetch from server');
        queryClient.invalidateQueries({
          queryKey: ['user-profile', userId],
        });
      }
    },
  });
};

// Hook to fetch user profile
export const useUserProfile = (userId?: string) => {
  const currentUserId = useTokenStore(selectUserId);
  const id = userId || currentUserId;

  return {
    queryKey: ['user-profile', id],
    enabled: !!id,
  };
};