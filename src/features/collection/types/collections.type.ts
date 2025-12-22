import { z } from "zod";
import { CollectionHeaderSchema } from "../schema/collection.schema";
import {
  CollectionData,
  FetchAllCollectionsDto,
  FetchAllCollectionsResponse,
  FetchCollectionDto,
} from "../dto/collections.dto";

export type ICollectionHeaderSchema = z.infer<typeof CollectionHeaderSchema>;
export type IFetchAllCollections = z.infer<typeof FetchAllCollectionsDto>;
export type FetchAllCollectionsResponseDto = z.infer<
  typeof FetchAllCollectionsResponse
>;
export type TCollectionData = z.infer<typeof CollectionData>;
export type IFetchCollection = z.infer<typeof FetchCollectionDto>;
