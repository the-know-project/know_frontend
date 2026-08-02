import { z } from "zod";
import { ListAssetDto } from "../dto/list-asset.dto";

export type IListAsset = z.infer<typeof ListAssetDto>;
