import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTokenStore } from "@/src/features/auth/state/store";
import { selectAccessToken } from "@/src/features/auth/state/selectors/token.selectors";

export interface UpdateProfileData {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  userSelection?: string;
  location?: string;
  phoneNumber?: string;
  sectionTitle?: string;
  description?: string;
  oldPassword?: string;
  newPassword?: string;
}

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const accessToken = useTokenStore(selectAccessToken);

  return useMutation({
    mutationFn: async (data: UpdateProfileData) => {
      const response = await fetch("/api/user/updateUser", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      return response.json();
    },

    onSuccess: (data) => {
      // Refetch user data
      queryClient.invalidateQueries({ queryKey: ["user"] });

      // Sync with auth store if needed
      const updateUser = useTokenStore.getState().updateUser;
      if (data.user) updateUser(data.user);
    },

    onError: (error: Error) => {
      console.error("Profile update failed:", error);
    },
  });
};
