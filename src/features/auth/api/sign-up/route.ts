import { ApiClient } from "@/src/lib/api-client";
import { AUTH_OP } from "../../data/auth.path";
import { ISignUp } from "../../types/auth.types";

export async function signUp(ctx: ISignUp) {
  return await ApiClient.post(AUTH_OP.SIGN_UP, ctx);
}
