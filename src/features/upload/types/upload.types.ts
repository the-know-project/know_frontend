import { z } from "zod";
import {
  SizePickerSchema,
  UploadSchema,
  UploadFormSchema,
  UploadAssetSchema,
  UploadAssetSchemaServer,
} from "../schema/upload.schema";
import { Result } from "neverthrow";
import { UploadError } from "../errors/upload.error";

export type IUploadForm = z.infer<typeof UploadSchema>;
export type IUploadFormState = z.infer<typeof UploadFormSchema>;
export type ISizePickerForm = z.infer<typeof SizePickerSchema>;
export type IUploadAsset = z.infer<typeof UploadAssetSchema>;
export type IUploadAssetServer = z.infer<typeof UploadAssetSchemaServer>;

type UploadData = {
  id: string;
  fileName: string;
  url: string;
};

export type TUploadResponseDto = {
  status: number;
  message: string;
  data: UploadData;
};

export type TUploadAsset = Result<TUploadResponseDto, UploadError>;
