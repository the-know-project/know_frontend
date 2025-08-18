import { z } from "zod";
import { RoleSchema } from "../schema/auth.schema";

const AuthSuccessDataDto = z.object({
  accessToken: z.string(),
  user: z.object({
    id: z.string().uuid(),
    email: z.string().email().min(1).max(100),
    firstName: z.string().min(1).max(100),
    imageUrl: z.string().url().min(1).max(100),
  }),
  role: RoleSchema.optional(),
  isFirstTime: z.boolean().optional(),
});

export const SendOtpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: z.string().min(1).max(100).optional(),
});

export const ValidateOtpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: z.string().min(1).max(100).optional(),
});

export const ResetPasswordResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: AuthSuccessDataDto.optional(),
});

export const SignUpResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: z.string().min(1).max(100).optional(),
});

export const LoginResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: AuthSuccessDataDto.optional(),
});

export const ForgotPasswordResponseDto = z.object({
  status: z.number(),
  message: z.string().min(1).max(100),
  data: AuthSuccessDataDto.optional(),
});
