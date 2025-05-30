import { z } from "zod";
import {
  LoginSchema,
  RoleSchema,
  SignUpFormSchema,
  SignUpSchema,
} from "../schema/auth.schema";

export type ISignUp = z.infer<typeof SignUpSchema>;
export type ILogin = z.infer<typeof LoginSchema>;
export type IRole = z.infer<typeof RoleSchema>;
export type ISignUpForm = z.infer<typeof SignUpFormSchema>;
