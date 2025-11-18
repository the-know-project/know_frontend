import { ApiClient } from "@/src/lib/api-client";
import { IUpdateProfileRequest } from "../../types/user.types";
import { PROFILE_OP } from "../../data/profile.route";

export async function updateProfile(ctx: IUpdateProfileRequest) {
  const formData = new FormData();
  Object.entries(ctx).forEach(([key, value]) => {
    if (typeof File !== "undefined" && (value as any) instanceof File) {
      console.log(`key: ${key}, value: ${value}`);
      formData.append(key, value);
    } else if (value !== undefined && value !== null) {
      formData.append(key, value as string);
    }
  });
  return await ApiClient.put(PROFILE_OP.UPDATE_PROFILE, formData);
}
