import { decryptData } from "@/src/utils/crypto";
import { AUTH_OP } from "../../../data/auth.path";
import { IOtpForm } from "../../../types/auth.types";
import { AuthenticatedApiClient } from "../../http/authenticated-client";

export async function vaidateOtp(ctx: IOtpForm) {
  const email = sessionStorage.getItem("email")
  const otp = ctx.otp

  return await AuthenticatedApiClient.post(AUTH_OP.VALIDATE_OTP, { email, otp })
}