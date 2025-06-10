import { ApiClient } from "@/src/lib/api-client";
import { IUploadAsset } from "../../types/upload.types";
import { ASSET_OP } from "../../data/upload.route";

export async function uploadAsset(ctx: IUploadAsset) {
  return ApiClient.post(ASSET_OP.UPLOAD, ctx);
}
