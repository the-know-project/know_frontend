import { z } from "zod";

// Schema for form state (allows optional file)
export const UploadFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  file: z
    .instanceof(File, { message: "Please select a file" })
    .refine(
      (file) => file.size <= 120 * 1024 * 1024,
      "File size must be less than 120MB",
    )
    .refine((file) => {
      const validTypes = ["image/png", "image/jpeg", "video/mp4"];
      return validTypes.includes(file.type);
    }, "Only PNG, JPEG images and MP4 videos are allowed")
    .optional(),
});

// Schema for submission (requires file)
export const UploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  file: z
    .instanceof(File, { message: "Please select a file" })
    .refine(
      (file) => file.size <= 120 * 1024 * 1024,
      "File size must be less than 120MB",
    )
    .refine((file) => {
      const validTypes = ["image/png", "image/jpeg", "video/mp4"];
      return validTypes.includes(file.type);
    }, "Only PNG, JPEG images and MP4 videos are allowed"),
});

export const SizePickerSchema = z.object({
  width: z.number().optional(),
  depth: z.number().optional(),
  length: z.number().optional(),
  height: z.number().optional(),
  weight: z.number(),
  diameter: z.number().optional(),
  aspectRatio: z.string().optional(),
  dimensionUnit: z.string().optional(),
  weightUnit: z.string().optional(),
});

export const UploadAssetSchemaServer = z.object({
  id: z.string().uuid(),
  fileName: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  asset: z
    .instanceof(File, { message: "Please select a file" })
    .refine(
      (file) => file.size <= 120 * 1024 * 1024,
      "File size must be less than 120MB",
    )
    .refine((file) => {
      const validTypes = ["image/png", "image/jpeg", "video/mp4"];
      return validTypes.includes(file.type);
    }, "Only PNG, JPEG images and MP4 videos are allowed"),
  size: SizePickerSchema,
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  customMetadata: z.array(z.string()).optional(),
});

export const UploadAssetSchema = z.object({
  fileName: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  asset: z
    .instanceof(File, { message: "Please select a file" })
    .refine(
      (file) => file.size <= 120 * 1024 * 1024,
      "File size must be less than 120MB",
    )
    .refine((file) => {
      const validTypes = ["image/png", "image/jpeg", "video/mp4"];
      return validTypes.includes(file.type);
    }, "Only PNG, JPEG images and MP4 videos are allowed"),
  size: SizePickerSchema,
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  customMetadata: z.array(z.string()).optional(),
});
