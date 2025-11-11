// src/lib/api/profile.ts
// Complete profile API using your actual backend endpoints

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
  createdAt?: string;
  updatedAt?: string;
}

export interface ProfileResponse {
  status: number;
  message?: string;
  data: UserProfile;
}

// Get user profile - Using your actual endpoint /api/user/userById
export async function getUserProfile(userId: string): Promise<ProfileResponse> {
  return await ApiClient.get<ProfileResponse>(`/api/user/userById?userId=${userId}`);
}

// Update profile data
export async function updateProfile(data: UpdateProfileRequest): Promise<ProfileResponse> {
  return await ApiClient.put<ProfileResponse>("/api/user/updateProfile", data);
}

// Update profile image
export async function updateProfileImage(userId: string, profileImage: File): Promise<ProfileResponse> {
  const formData = new FormData();
  formData.append("userId", userId);
  formData.append("profileImage", profileImage);

  return await ApiClient.post<ProfileResponse>("/api/user/uploadProfileImage", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}