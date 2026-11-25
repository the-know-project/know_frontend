import axios from "axios";
import { ApiClient } from "@/src/lib/api-client";
import { useTokenStore } from "@/src/features/auth/state/store";
import { IUploadAssetServer } from "../../types/upload.types";
import { ASSET_OP } from "../../data/upload.route";
import { convertToFormDataWithJSON } from "../../utils/form-data.utils";

export async function uploadAsset(
  ctx: IUploadAssetServer,
  onProgress?: (percent: number | null) => void,
) {
  const formData = convertToFormDataWithJSON(ctx);
  const token = useTokenStore.getState().accessToken;
  const response = await axios.post(
    `${ApiClient.getBaseUrl()}${ASSET_OP.UPLOAD}`,
    formData,
    {
      timeout: 180_000,
      headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      onUploadProgress: (event) => {
        if (event.total) {
          onProgress?.(
            Math.min(100, Math.round((event.loaded / event.total) * 100)),
          );
          if (event.loaded >= event.total) onProgress?.(null);
        }
      },
    },
  );
  return response.data;
}
