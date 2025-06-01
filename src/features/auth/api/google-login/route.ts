import { AUTH_OP } from "../../data/auth.path";
import { AuthenticatedApiClient } from "../http/authenticated-client";

export function googleLogin() {
  return AuthenticatedApiClient.window(AUTH_OP.GOOGLE_LOGIN);
}
