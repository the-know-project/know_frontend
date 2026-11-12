import { z } from "zod";

// Schema for form state (allows optional file)
export const UploadFormSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  files: z
    .array(
      z
        .instanceof(File, { message: "Please select a file" })
        .refine(
          (file) => file.size <= 120 * 1024 * 1024,
          "File size must be less than 120MB",
        )
        .refine((file) => {
          const validTypes = ["image/png", "image/jpeg", "video/mp4"];
          return validTypes.includes(file.type);
        }, "Only PNG, JPEG images and MP4 videos are allowed"),
    )
    .min(1, "Please select at least one file")
    .max(5, "Maximum of 5 files allowed")
    .optional(),
});

export const UploadSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  files: z
    .array(
      z
        .instanceof(File, { message: "Please select a file" })
        .refine(
          (file) => file.size <= 120 * 1024 * 1024,
          "File size must be less than 120MB",
        )
        .refine((file) => {
          const validTypes = ["image/png", "image/jpeg", "video/mp4"];
          return validTypes.includes(file.type);
        }, "Only PNG, JPEG images and MP4 videos are allowed"),
    )
    .min(1, "Please select at least one file")
    .max(5, "Maximum of 5 files allowed"),
});

export const SizePickerSchema = z.object({
  width: z.number().min(0).optional(),
  depth: z.number().min(0).optional(),
  length: z.number().min(0).optional(),
  height: z.number().min(0).optional(),
  weight: z.number().min(0),
  diameter: z.number().min(0).optional(),
  aspectRatio: z.string().optional(),
  dimensionUnit: z.string().optional(),
  weightUnit: z.string().optional(),
});

export const UploadAssetSchemaServer = z.object({
  userId: z.string().uuid(),
  fileName: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  description: z.string().optional(),
  asset: z.union([z.instanceof(File), z.array(z.instanceof(File))]),
  size: SizePickerSchema,
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  customMetadata: z.record(z.string()).optional(),
});

export const UploadAssetSchema = z.object({
  fileName: z
    .string()
    .min(1, "Title is required")
    .max(100, "Title must be less than 100 characters"),
  asset: z.union([z.instanceof(File), z.array(z.instanceof(File))]),
  size: SizePickerSchema,
  categories: z.array(z.string()),
  tags: z.array(z.string()),
  customMetadata: z.record(z.string()).optional(),
});
