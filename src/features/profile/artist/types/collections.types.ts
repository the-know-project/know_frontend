import { z } from "zod";
import {
  CollectionData,
  FetchAllCollectionsDto,
  FetchAllCollectionsResponse,
} from "../dto/collections.dto";

export type IFetchAllCollections = z.infer<typeof FetchAllCollectionsDto>;
export type FetchAllCollectionsResponseDto = z.infer<
  typeof FetchAllCollectionsResponse
>;
export type TCollectionData = z.infer<typeof CollectionData>;
