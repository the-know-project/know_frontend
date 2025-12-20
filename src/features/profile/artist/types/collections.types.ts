import { z } from "zod";
import { FetchAllCollectionsDto } from "../dto/collections.dto";

export type IFetchAllCollections = z.infer<typeof FetchAllCollectionsDto>;
