import { ApiClient } from "@/src/lib/api-client";
import { IUploadAssetServer } from "../../types/upload.types";
import { ASSET_OP } from "../../data/upload.route";

export async function uploadAsset(ctx: IUploadAssetServer) {
  return ApiClient.post(ASSET_OP.UPLOAD, ctx);
}
