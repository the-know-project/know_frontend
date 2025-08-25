import { AUTH_OP } from "../../../data/auth.path";
import { IForgotPassword } from "../../../types/auth.types";
import { AuthenticatedApiClient } from "../../http/authenticated-client";

export async function sendOtp(ctx: IForgotPassword) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("email", ctx.email);
  }

  return await AuthenticatedApiClient.post(AUTH_OP.FORGOT_PASSWORD, ctx);
}
