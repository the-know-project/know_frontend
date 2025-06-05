import { z } from "zod";
import { RoleSchema } from "../schema/auth.schema";

const AuthSuccessDataDto = z.object({
  id: z.string().uuid(),
  email: z.string().email().min(1).max(100),
  refreshToken: z.string(),
  accessToken: z.string(),
  role: RoleSchema,
  isFirstTime: z.boolean(),
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
