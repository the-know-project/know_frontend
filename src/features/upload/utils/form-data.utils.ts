import { IUploadAssetServer } from "../types/upload.types";

export function transformCustomMetadata(
  metadataArray: string[],
): Record<string, string> {
  const result: Record<string, string> = {};
  metadataArray.forEach((item, index) => {
    result[index.toString()] = item;
  });
  return result;
}

export function convertToFormData(data: IUploadAssetServer): FormData {
  const formData = new FormData();

  formData.append("userId", data.userId);
  formData.append("fileName", data.fileName);

  formData.append("asset", data.asset);

  if (data.size) {
    Object.entries(data.size).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        formData.append(`size[${key}]`, value.toString());
      }
    });
  }

  if (data.categories && data.categories.length > 0) {
    data.categories.forEach((category, index) => {
      formData.append(`categories[${index}]`, category);
    });
  }

  if (data.tags && data.tags.length > 0) {
    data.tags.forEach((tag, index) => {
      formData.append(`tags[${index}]`, tag);
    });
  }

  if (data.customMetadata && Object.keys(data.customMetadata).length > 0) {
    Object.entries(data.customMetadata).forEach(([key, value]) => {
      formData.append(`customMetadata[${key}]`, value);
    });
  }

  return formData;
}

export function convertToFormDataWithJSON(data: IUploadAssetServer): FormData {
  const formData = new FormData();

  formData.append("userId", data.userId);
  formData.append("fileName", data.fileName);

  formData.append("asset", data.asset);

  formData.append("size", JSON.stringify(data.size));
  formData.append("categories", JSON.stringify(data.categories));
  formData.append("tags", JSON.stringify(data.tags));

  if (data.customMetadata) {
    formData.append("customMetadata", JSON.stringify(data.customMetadata));
  }

  return formData;
}
