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
