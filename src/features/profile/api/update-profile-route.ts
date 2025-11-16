import { ApiClient } from "@/src/lib/api-client";
import { UpdateProfileData } from "../hooks/use-update-profile";

export async function updateProfile(data: UpdateProfileData) {
  console.log("🌐 API: Updating profile for user:", data.userId);
  
  // Using your existing /api/user/updateUser endpoint
  return await ApiClient.post(`/api/user/updateUser`, {
    ...data,
  });
}
