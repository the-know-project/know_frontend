import { z } from "zod";
import { SizePickerSchema, UploadSchema, UploadFormSchema } from "../schema/upload.schema";

export type IUploadForm = z.infer<typeof UploadSchema>;
export type IUploadFormState = z.infer<typeof UploadFormSchema>;
export type ISizePickerForm = z.infer<typeof SizePickerSchema>;
