import { AUTH_OP } from "../../data/auth.path";
import { IResetPassword } from "../../types/auth.types";
import { AuthenticatedApiClient } from "../http/authenticated-client";

export async function createNewPassword(ctx: IResetPassword) {
  const email = sessionStorage.getItem("email")
  if (!email) return

  return await AuthenticatedApiClient.post(AUTH_OP.CREATE_NEW_PASSWORD, { email, password: ctx.password })
}