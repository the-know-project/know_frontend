import { z } from "zod";
import { FetchAssetSchema, LikeAssetSchema } from "../schema/explore.schema";
import { Asset } from "../dto/explore.dto";

export type TFetchExploreAsset = z.infer<typeof FetchAssetSchema>;
export type TAsset = z.infer<typeof Asset>;
export type TLikeAsset = z.infer<typeof LikeAssetSchema>;
