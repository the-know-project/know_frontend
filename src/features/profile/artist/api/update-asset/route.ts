import { ApiClient } from "@/src/lib/api-client";
import { PROFILE_OP } from "../../../data/profile.route";

export interface IUpdateAssetRequest {
  fileId: string;
  fileName: string;
  description?: string;
  size: {
    width?: number;
    height?: number;
    depth?: number;
    diameter?: number;
    length?: number;
    weight: number;
    dimensionUnit?: string;
    weightUnit?: string;
    aspectRatio?: string;
  };
  categories: string[];
  tags: string[];
}

export function updateAsset(data: IUpdateAssetRequest) {
  return ApiClient.post(PROFILE_OP.UPDATE_ASSET, data);
}
