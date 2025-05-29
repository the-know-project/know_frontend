import { AUTH_OP } from "../../data/auth.path";
import { ISignUp } from "../../types/auth.types";
import { AuthenticatedApiClient } from "../http/authenticated-client";

export async function signUp(ctx: ISignUp) {
  return await AuthenticatedApiClient.post(AUTH_OP.SIGN_UP, ctx);
}
