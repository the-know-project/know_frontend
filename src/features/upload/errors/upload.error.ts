import { UploadAssetErrorMessages } from "../data/upload.data";

export class UploadError extends Error {
  constructor(
    message: string = UploadAssetErrorMessages.ERROR_UPLOADING_ASSET,
  ) {
    super(message);
    this.name = "UploadError";
  }
}
