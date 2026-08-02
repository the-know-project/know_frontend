import { ApiClient } from "@/src/lib/api-client";
import { PROFILE_OP } from "../../../data/profile.route";

export function UnlistAsset(fileId: string) {
  return ApiClient.post(PROFILE_OP.UNLIST_ASSET, {
    fileId: fileId,
  });
}
