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
