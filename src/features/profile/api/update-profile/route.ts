import { ApiClient } from "@/src/lib/api-client";
import { IUpdateProfileRequest } from "../../types/user.types";
import { PROFILE_OP } from "../../data/profile.route";

export async function updateProfile(ctx: IUpdateProfileRequest) {
  const formData = new FormData();

  const fieldMapping: Record<string, string> = {
    profileImage: "profilePicture",
  };

  Object.entries(ctx).forEach(([key, value]) => {
    const fieldName = fieldMapping[key] || key;

    if (value instanceof File) {
      formData.append(fieldName, value, value.name);
    } else if (value !== undefined && value !== null && value !== "") {
      formData.append(fieldName, String(value));
    }
  });

  console.log("FormData entries:");
  for (const [key, value] of formData.entries()) {
    console.log(key, value);
  }

  return await ApiClient.put(PROFILE_OP.UPDATE_PROFILE, formData, {
    headers: {
      "Content-Type": undefined,
    },
  });
}
