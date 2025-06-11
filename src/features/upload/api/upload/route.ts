import { ApiClient } from "@/src/lib/api-client";
import { IUploadAssetServer } from "../../types/upload.types";
import { ASSET_OP } from "../../data/upload.route";
import { convertToFormDataWithJSON } from "../../utils/form-data.utils";

export async function uploadAsset(ctx: IUploadAssetServer) {
  const formData = convertToFormDataWithJSON(ctx);

  return ApiClient.post(ASSET_OP.UPLOAD, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}
