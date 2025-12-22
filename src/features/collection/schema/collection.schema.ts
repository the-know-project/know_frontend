import { z } from "zod";

export const CollectionHeaderSchema = z.object({
  firstName: z.string().optional().or(z.literal("")),
  lastName: z.string().optional().or(z.literal("")),
  title: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  bannerUrl: z.string().optional().or(z.literal("")),
  profileUrl: z.string().optional().or(z.literal("")),
  numOfArt: z.number().optional(),
  price: z.string().optional().or(z.literal("")),
});
