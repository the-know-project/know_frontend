import { z } from "zod";
import { FetchAssetSchema } from "../schema/explore.schema";

export type TFetchExploreAsset = z.infer<typeof FetchAssetSchema>;
