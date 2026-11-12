import { z } from "zod";
import { ListAssetDto } from "../dto/list-asset.dto";
import { DeleteAssetDto } from "../dto/delete-asset.dto";

export type IListAsset = z.infer<typeof ListAssetDto>;
export type IDeleteAsset = z.infer<typeof DeleteAssetDto>;
