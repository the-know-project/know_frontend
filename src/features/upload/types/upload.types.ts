import { z } from "zod";
import { UploadSchema } from "../schema/upload.schema";

export type IUploadForm = z.infer<typeof UploadSchema>;
