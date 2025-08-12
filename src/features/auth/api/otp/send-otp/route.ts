import { encryptData } from "@/src/utils/crypto";
import { AUTH_OP } from "../../../data/auth.path";
import { ISignUp } from "../../../types/auth.types";
import { AuthenticatedApiClient } from "../../http/authenticated-client";

export async function sendOtp(ctx: ISignUp) {
  sessionStorage.setItem("sign-up", await encryptData(JSON.stringify(ctx)));
  sessionStorage.setItem("email", ctx.email)
  
  return await AuthenticatedApiClient.post(AUTH_OP.SEND_OTP, { email: ctx.email })
}