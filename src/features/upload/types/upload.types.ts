import { z } from "zod";
import {
  SizePickerSchema,
  UploadSchema,
  UploadFormSchema,
  UploadAssetSchema,
} from "../schema/upload.schema";

export type IUploadForm = z.infer<typeof UploadSchema>;
export type IUploadFormState = z.infer<typeof UploadFormSchema>;
export type ISizePickerForm = z.infer<typeof SizePickerSchema>;
export type IUploadAsset = z.infer<typeof UploadAssetSchema>;
