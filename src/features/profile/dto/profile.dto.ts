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
    firstName: z.string().min(1, "First name is required"),
    lastName: z.string().min(1, "Last name is required"),
    email: z.string().email("Invalid email address"),
    userSelection: z.string().min(1, "User selection is required"),
    country: z.string().min(1, "Location is required"),
    phoneNumber: z.string().optional(),
    sectionTitle: z.string().optional(),
    description: z.string().optional(),
    oldPassword: z.string().optional(),
    newPassword: z.string().optional(),
    confirmPassword: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.oldPassword) {
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
      if (data.newPassword && data.newPassword !== data.confirmPassword) {
        return false;
      }
      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );
