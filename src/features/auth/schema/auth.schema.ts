import { z } from "zod";

export const RoleSchema = z.enum(["ARTIST", "BUYER", "NONE"]);

export const SignUpSchema = z.object({
  firstName: z.string().min(2).max(100),
  lastName: z.string().min(2).max(100),
  userName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(6).max(100),
  role: RoleSchema,
});

export const SignUpFormSchema = z.object({
  firstName: z.string().min(2, "at least 2 characters").max(100),
  lastName: z.string().min(2, "at least 2 characters").max(100),
  userName: z.string().min(2, "at least 2 characters").max(100),
  email: z.string().email(),
  password: z.string().min(6, "at least 6 characters").max(100),
});

export const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(100),
});
