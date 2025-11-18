import { z } from "zod";

export const ArtistDetailsDataSchema = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  imageUrl: z.string().url(),
  username: z.string(),
  role: z.string(),
});

export const ArtistDetailsDtoSchema = z.object({
  status: z.number(),
  message: z.string(),
  data: ArtistDetailsDataSchema,
  meta: z.any().nullable(),
});

export const UpdateProfileSchema = z.object({
  userId: z.string(),
  email: z.string().email(),
  description: z.string(),
  name: z.string(),
  profilePicture: z.instanceof(File),
  username: z.string(),
  password: z.string(),
  oldPassword: z.string(),
  newPassword: z.string(),
  country: z.string(),
  address: z.string(),
  city: z.string(),
  state: z.string(),
  postalCode: z.string(),
});

export const ProfileFormSchema = z
  .object({
    firstName: z.string().optional().or(z.literal("")),
    lastName: z.string().optional().or(z.literal("")),
    email: z.string().email("Invalid email address").optional().or(z.literal("")),
    userSelection: z.string().optional().or(z.literal("")),
    country: z.string().optional().or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
    sectionTitle: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    oldPassword: z.string().optional().or(z.literal("")),
    newPassword: z.string().optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0 && !data.oldPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Old password is required to set a new password",
      path: ["oldPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && data.newPassword.length > 0 && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type ProfileFormData = z.infer<typeof ProfileFormSchema>;