import { z } from "zod";
import { SignUpSchema } from "../schema/auth.schema";

export type ISignUp = z.infer<typeof SignUpSchema>;
