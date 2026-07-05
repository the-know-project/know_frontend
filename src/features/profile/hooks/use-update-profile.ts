import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRoleStore, useTokenStore } from "@/src/features/auth/state/store";
import { selectUserId } from "@/src/features/auth/state/selectors/token.selectors";
import { IUpdateProfileRequest } from "../types/user.types";
import { ProfileError } from "../error/profile.error";
import { err, ok, ResultAsync } from "neverthrow";
import { updateProfile } from "../api/update-profile/route";
import { IUpdateProfileResponseDto } from "../types/profile.types";
import { showLog } from "@/src/utils/logger";
import { IRole } from "../../auth/types/auth.types";

type UpdateProfileParams = Omit<IUpdateProfileRequest, "userId">;
export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  const userId = useTokenStore(selectUserId);

  return useMutation({
    mutationFn: async (data: UpdateProfileParams) => {
      if (!userId) {
        throw new ProfileError("User not authenticated");
      }

      const result = await ResultAsync.fromPromise(
        updateProfile({
          ...data,
          userId,
        }),
        (error) => new ProfileError(`Error updating user profile ${error}`),
      ).andThen((result) => {
        if (result.status === 200) {
          return ok(result);
        } else {
          return err(new ProfileError("Failed to update profile"));
        }
      });

      if (result.isErr()) {
        throw result.error;
      }

      showLog({
        context: "Update Profile Information",
        data: result.value,
      });
      return result.value as IUpdateProfileResponseDto;
    },

    onSuccess: (result, params) => {
      const updateUser = useTokenStore.getState().updateUser;
      if (result.data) {
        updateUser(result.data);
      }

      if (params.role) {
        if (params.role !== useRoleStore.getState().role) {
          console.log("Role has changed, updating role in store");
          useRoleStore.getState().setRole(result.data.role as IRole);
        }
      }

      queryClient.invalidateQueries({
        queryKey: ["user", "fetch-explore-asset"],
      });
    },

    onError: (error: Error) => {
      console.error("Profile update failed:", error);
    },
  });
};
