import { encryptData } from "@/src/utils/crypto";
import { AUTH_OP } from "../../../data/auth.path";
import { ISignUp } from "../../../types/auth.types";
import { ApiClient } from "@/src/lib/api-client";

export async function sendOtp(ctx: ISignUp) {
  if (typeof window !== "undefined") {
    sessionStorage.setItem("sign-up", await encryptData(JSON.stringify(ctx)));
    sessionStorage.setItem("email", ctx.email);
  }

  return await ApiClient.post(AUTH_OP.SEND_OTP, {
    email: ctx.email,
  });
}
