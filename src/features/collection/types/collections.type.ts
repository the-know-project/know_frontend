import { z } from "zod";
import { CollectionHeaderSchema } from "../schema/collection.schema";

export type ICollectionHeaderSchema = z.infer<typeof CollectionHeaderSchema>;
