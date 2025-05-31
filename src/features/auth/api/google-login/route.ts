import { AUTH_OP } from "../../data/auth.path";
import { AuthenticatedApiClient } from "../http/authenticated-client";

export async function googleLogin() {
  return await AuthenticatedApiClient.get(AUTH_OP.GOOGLE_LOGIN);
}
