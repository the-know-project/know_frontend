import { z } from "zod";

export type IListAsset = z.infer<typeof ListAssetDto>;
