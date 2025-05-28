import { z } from "zod";
import { LoginSchema, SignUpSchema } from "../schema/auth.schema";

export type ISignUp = z.infer<typeof SignUpSchema>;
export type ILogin = z.infer<typeof LoginSchema>;
