import { AUTH_OP } from "../../../data/auth.path";
import { IOtpForm } from "../../../types/auth.types";
import { ApiClient } from "@/src/lib/api-client";

export async function vaidateOtp(ctx: IOtpForm) {
  if (typeof window === "undefined") return;

  const email = sessionStorage.getItem("email");
  const otp = ctx.otp;

  return await ApiClient.post(AUTH_OP.VALIDATE_OTP, {
    email,
    otp,
  });
}
