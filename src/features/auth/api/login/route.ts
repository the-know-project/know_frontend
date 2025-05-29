import { AUTH_OP } from "../../data/auth.path";
import { ILogin } from "../../types/auth.types";
import { AuthenticatedApiClient } from "../http/authenticated-client";

export async function login(ctx: ILogin) {
  return await AuthenticatedApiClient.post(AUTH_OP.LOGIN, ctx);
}
