import { z } from "zod";

// User base schema
export const UserSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum(["Artist", "Buyer", "Both"]).optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  profileImage: z.string().optional(),
  sectionTitle: z.string().optional(),
  description: z.string().optional(),
  createdAt: z.string().optional(),
  updatedAt: z.string().optional(),
});

// Social links schema
export const SocialLinksSchema = z.object({
  instagram: z.string().optional(),
  discord: z.string().optional(),
  behance: z.string().optional(),
  twitter: z.string().optional(),
  linkedin: z.string().optional(),
});

// Payment info schema
export const PaymentInfoSchema = z.object({
  cardType: z.string().optional(),
  lastFourDigits: z.string().optional(),
  expiryDate: z.string().optional(),
  email: z.string().optional(),
});

// Full user profile schema
export const UserProfileSchema = UserSchema.extend({
  socialLinks: SocialLinksSchema.optional(),
  paymentInfo: PaymentInfoSchema.optional(),
});

// Type exports
export type IUser = z.infer<typeof UserSchema>;
export type ISocialLinks = z.infer<typeof SocialLinksSchema>;
export type IPaymentInfo = z.infer<typeof PaymentInfoSchema>;
export type IUserProfile = z.infer<typeof UserProfileSchema>;

// Update profile request schema
export const UpdateProfileRequestSchema = z.object({
  userId: z.string(),
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  userSelection: z.string().optional(),
  location: z.string().optional(),
  phoneNumber: z.string().optional(),
  sectionTitle: z.string().optional(),
  description: z.string().optional(),
  oldPassword: z.string().optional(),
  newPassword: z.string().optional(),
});

export type IUpdateProfileRequest = z.infer<typeof UpdateProfileRequestSchema>;