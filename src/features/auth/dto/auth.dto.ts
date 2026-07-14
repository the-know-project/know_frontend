import { z } from "zod";
import { RoleSchema } from "../schema/auth.schema";

const AuthSuccessDataDto = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().min(1).max(100),
    firstName: z.string().min(1).max(100),
    imageUrl: z.string().url().optional(),
    role: RoleSchema.optional(),
    isFirstTime: z.boolean().optional(),
  }),
});

const SignUpSuccessDataDto = z.object({
  id: z.string().uuid(),
  email: z.string().email().min(1).max(100),
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  role: RoleSchema.optional(),
  authProvider: z.string().min(1).max(100),
  isFirstTime: z.boolean().optional(),
  imageUrl: z.string().url().optional(),
});

export const SendOtpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: z.string().min(1).max(100).nullable().optional(),
});

export const ValidateOtpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: z.string().min(1).max(100).nullable().optional(),
});

export const ResetPasswordResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: AuthSuccessDataDto.optional().nullable(),
});

export const SignUpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: SignUpSuccessDataDto,
});

export const LoginResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: AuthSuccessDataDto,
});

export const ForgotPasswordResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: AuthSuccessDataDto.optional().nullable(),
});
