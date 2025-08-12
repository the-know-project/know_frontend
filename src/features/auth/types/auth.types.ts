import { z } from "zod";
import {
  ForgotPasswordSchema,
  LoginSchema,
  OtpFormSchema,
  ResetPasswordSchema,
  RoleSchema,
  SignUpFormSchema,
  SignUpSchema,
} from "../schema/auth.schema";
import { SignUpResponseDto } from "../dto/auth.dto";

export interface ILoginSuccess {
  status: number;
  message: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    imageUrl: string;
  };
  tokens: {
    accessToken: string;
    refreshToken: string;
  };
  role?: IRole;
  isFirstTime: boolean;
}

export interface IForgotPasswordSuccess {
  status: number;
  message: string;
  // tokens: {
  //   accessToken: string;
  //   refreshToken: string;
  // };
}

export type ISignUp = z.infer<typeof SignUpSchema>;
export type ILogin = z.infer<typeof LoginSchema>;
export type IRole = z.infer<typeof RoleSchema>;
export type ISignUpForm = z.infer<typeof SignUpFormSchema>;
export type ISignUpResponseDto = z.infer<typeof SignUpResponseDto>;
export type IOtpForm = z.infer<typeof OtpFormSchema>;
export type IForgotPassword = z.infer<typeof ForgotPasswordSchema>;
export type IResetPassword = z.infer<typeof ResetPasswordSchema>;
