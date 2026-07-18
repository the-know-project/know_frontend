import { ApiClient } from "@/src/lib/api-client";
import { AUTH_OP } from "../../../data/auth.path";
import { IForgotPassword } from "../../../types/auth.types";

export async function sendOtp(ctx: IForgotPassword) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("email", ctx.email);
  }

  return await ApiClient.post(AUTH_OP.FORGOT_PASSWORD, ctx);
}
