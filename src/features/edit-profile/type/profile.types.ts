import { ApiClient } from "@/src/lib/api-client";

export interface UpdateProfileRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  location?: string;
  userSelection?: "artist" | "client";
  sectionTitle?: string;
  description?: string;
  instagram?: string;
  discord?: string;
  behance?: string;
  oldPassword?: string;
  newPassword?: string;
}

export interface UpdateProfileImageRequest {
  userId: string;
  profileImage: File;
}

export interface UserProfile {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  location?: string;
  userSelection?: "artist" | "client";
  sectionTitle?: string;
  description?: string;
  profileImage?: string;
  instagram?: string;
  discord?: string;
  behance?: string;
  createdAt: string;
  updatedAt: string;
}

// Update profile data
export async function updateProfile(data: UpdateProfileRequest) {
  return await ApiClient.put("/api/user/updateProfile", data);
}

// Update profile image
export async function updateProfileImage(data: UpdateProfileImageRequest) {
  const formData = new FormData();
  formData.append("userId", data.userId);
  formData.append("profileImage", data.profileImage);

  return await ApiClient.post("/api/user/uploadProfileImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

// Get user profile
export async function getUserProfile(userId: string) {
  return await ApiClient.get("/api/user/profile", {
    params: { userId },
  });
}