import { z } from "zod";
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
