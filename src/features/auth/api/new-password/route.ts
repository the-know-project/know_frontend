import { ApiClient } from "@/src/lib/api-client";
import { AUTH_OP } from "../../data/auth.path";
import { IResetPassword } from "../../types/auth.types";

export async function createNewPassword(ctx: IResetPassword) {
  if (typeof window === "undefined") return;

  const email = sessionStorage.getItem("email");
  if (!email) return;

  return await ApiClient.post(AUTH_OP.CREATE_NEW_PASSWORD, {
    email,
    newPassword: ctx.password,
  });
}
